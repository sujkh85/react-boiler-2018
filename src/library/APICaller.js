import axios from 'axios';
import APICache from './APICache';
import Async from './Async';

let config = {
	debug : false,
	caching: false,
	offlineMode : false,
	healthCheckTime : 10000,
	hostName: null
}

function getAPIHost() {
	if (process.env.NODE_ENV === 'development') {
		if (config.hostName) {
			return config.hostName;
		}
		return '';
	} else if (process.env.NODE_ENV === 'test') {
		return '';
	} else {
		return '';
	}
}

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function getMakeURL(url) {
	if (url.indexOf('http') === 0) {
		return url;
	} else if (url.substr(0, 1) === '.') {
		return url;
	} else {
		if (url.substr(0, 1) === '/') {
			return getAPIHost().concat(url);
		} else {
			return getAPIHost().concat('/', url);
		}
	}	
}

class APIMonitor {
	static initialize() {
		this._errorTime = null;
		this._isLive = true;
		this._isStart = false;
	}

	static start() {
		console.log('APIMonitor START');
		this._isLive = true;
		this._isStart = true;

		this.timerGate();
	}

	static stop() {
		console.log('APIMonitor STOP');
		this._isStart = false;
		if (this.instanceTimer) {
			clearTimeout(this.instanceTimer);
			clearTimeout(this.retryTimer);
			this.instanceTimer = undefined;
		}
	}

	static timerGate() {
		if (this._isStart === true) {
			if (this.instanceTimer) {
				clearTimeout(this.instanceTimer);
				clearTimeout(this.retryTimer);
				this.instanceTimer = undefined;
			}
			this.instanceTimer = setTimeout(() => {
				this.instanceTimer = undefined;
				this.timerHealthCheck();
			}, config.healthCheckTime);
		}
	}

	static _httpCall(type) {
		const fullUrl = getMakeURL('https://health.wink.co.kr/static/health.txt?t=' + Date.now() + '&l=' + type);
		return axios({
			method: 'get',
			url: fullUrl,
			responseType: 'text',
			withCredentials: false,
		});
	}

	static timerHealthCheck() {
		if (config.caching === true) {
			clearTimeout(this.retryTimer);
			new Promise((resolve, reject) => {
				this._httpCall('apimonitor').then((response) => {
					if (this._isLive === false) {
						this.retryTimer = setTimeout(() => {
							this._httpCall('apimonitor_on_retry').then((response) => {
								console.log('apimonitor_on(retry) : online');
								this._isLive = true;
								resolve(true);
							}).catch((e) => {
								clearTimeout(this.retryTimer);
								console.log('apimonitor_on(retry) : offline');
								this.networkError();	
								reject(false);
							});
						}, 2000);
					} else {
						clearTimeout(this.retryTimer);
						resolve(true);
					}
				}).catch((e) => {
					console.log('apimonitor : health check error');
					this.retryTimer = setTimeout(() => {
						clearTimeout(this.retryTimer);
						this._httpCall('apimonitor_retry').then((response) => {
							console.log('apimonitor(retry) : online');
							resolve(true);
						}).catch((e) => {
							clearTimeout(this.retryTimer);
							console.log('apimonitor(retry) : offline');
							this.networkError();	
							reject(false);
						});
					}, 1000)
				})
			})
			.then((result) => {
				this.timerGate();
			}).catch((result) => {
				this.timerGate();
			})
		}
	}
	
	static networkError() {
		this._errorTime = Date.now();
		this._isLive = false;
	}

	static get isLive() {
		return this._isLive;
	}

	static get isStart() {
		return this._isStart;
	}

	static defaults = {
		set healthCheckTime(value) {config.healthCheckTime = value;}
	}
}

class APICaller {
	static _networkErrorMessage = {
		response: {
			status: 10000,
			data: [
				'인터넷 접속이 원활하지 않습니다.<br />와이파이 연결 상태를 확인하시고 잠시 후 다시 시도해 주세요'
			]
		}
	};
	static _networkErrorPromise() {
		return new Promise((resolve, reject) => {
			reject(APICaller._networkErrorMessage);
		});
	}
	static checkURL(url) {
		if (url.indexOf('/null/') !== -1 || url.indexOf('/undefined/') !== -1 || url.indexOf('/NaN/') !== -1) {
			return false;
		}
		return true;
	}
	static post(url, params = null) {
		if (APIMonitor.isLive === false) {
			return APICaller._networkErrorPromise();
		}
		const fullUrl = getMakeURL(url);
		if (APICaller.checkURL(url) === false) {
			throw Error('null parameter exception : ' + fullUrl);
		}
		const axiosParams = params !== null ? params : {};
		return axios.post(fullUrl, axiosParams);
	}
	static directGet(url, responseType = 'text') {
		const fullUrl = getMakeURL(url);
		return axios({
			method: 'get',
			url: fullUrl,
			responseType: 'text',
			withCredentials: false,
		})
	}
	static get(url, params = null) {
		const fullUrl = getMakeURL(url);
		if (APICaller.checkURL(url) === false) {
			throw Error('null parameter exception : ' + fullUrl);
		}
		const axiosParams = params !== null ? {params:{...params}} : {params:{}};
		if (config.offlineMode === true) {
			return APICache.get(url, params);
		}

		if (APIMonitor.isLive === false)  {
			if (APICache.status === true) {
				return new Promise((resolve, reject) => {
					APICache.get(url, params).then((response) => {
						if (response) {
							console.log('%c cache data [ Network error ] : ', 'color: #1299a8; font-weight: bold', url);
							resolve(response)
						} else {
							if (APIMonitor.isLive === false) {
								reject(APICaller._networkErrorMessage);
							}
							axios.get(fullUrl, axiosParams).then((response)=> {
								console.log('%c retry api call [ Network error ] : ', 'color: #1299a8; font-weight: bold', url);
								if (config.caching === true) {
									APICache.put(url, params, response);
								}
								resolve(response);
							}).catch((e) => {
								reject(e);
							})
						}
					});
				})
			}
		}

		return axios.get(fullUrl, axiosParams).then((response)=> {
			if (config.caching === true) {
				APICache.put(url, params, response);
			}
			return response;
		}).catch((e) => {
			if (config.caching === true) {
				if (e.response && (e.response.status < 400 || e.response.status >= 500)) {
					return new Promise((resolve, reject) => {
						//APIMonitor.networkError();
						APICache.get(url, params).then((response) => {
							if (response) {
								console.log('%c cache data :', 'color: #371d8c; font-weight: bold', url);
								resolve(response);
							} else {
								setTimeout(() => {
									axios.get(fullUrl, axiosParams).then((response)=> {
										if (config.caching === true) {
											APICache.put(url, params, response);
										}
										console.log('%c retry api call :', 'color: #371d8c; font-weight: bold', url);
										resolve(response);
									}).catch((e) => {
										reject(e);
									});
								}, 500);
							}
						})
					})
				} else if (!e.response || e.message === 'Network Error' || e.message.substr(0, 7) === 'timeout') {
					return new Promise((resolve, reject) => {
						//APIMonitor.networkError();
						APICache.get(url, params).then((response) => {
							if (response) {
								console.log('%c cache data :', 'color: #371d8c; font-weight: bold', url);
								resolve(response);
							} else {
								setTimeout(() => {
									axios.get(fullUrl, axiosParams).then((response)=> {
										if (config.caching === true) {
											APICache.put(url, params, response);
										}
										console.log('%c retry api call :', 'color: #371d8c; font-weight: bold', url);
										resolve(response);
									}).catch((e) => {
										reject(e);
									});
								}, 500);
							}
						})
					});
				}
			}
			throw e;
		});
	}
	static lastCall = {};
	static getCache(url) {
		if (APICaller.checkURL(url) === false) {
			throw Error('null parameter exception : ' + url);
		}
		return Async(function* (url) {
			let result;
			const cacheData = sessionStorage.getItem(url);
			let isData = false;
			if (cacheData) {
				isData = true;
				result = JSON.parse(cacheData);
				if (Date.now() - result.time > (60 * 1000 * 10) ) {
					isData = false;
				}
			}
			if (isData === false) {
				result = yield APICaller.get(url);
				result.time = Date.now();
				sessionStorage.setItem(url, JSON.stringify(result));

				// 	if (!APICaller.lastCall[url]) {
				// 		APICaller.lastCall[url] = 0;
				// 	}
				// 	if (result) {
				// 		if (Date.now() - APICaller.lastCall[url] > 1000) {
				// 			APICaller.lastCall[url] = Date.now();
				// 			APICaller.get(url).then((response) => {
				// 				response.time = Date.now();
				// 				sessionStorage.setItem(url, JSON.stringify(response));
				// 			});
				// 		}
				// 	} else {
				// 		APICaller.lastCall[url] = Date.now();
				// 		result = yield APICaller.get(url);
				// 		result.time = Date.now();
				// 		sessionStorage.setItem(url, JSON.stringify(result));
				// 	}
			}
			return result;
		}, url);
	}
	static fileUpload(url, formData, onUploadProgress) {
		const fullUrl = getMakeURL(url);
		
		if (APICaller.checkURL(url) === false) {
			throw Error('null parameter exception : ' + fullUrl);
		}

		const options = {
			headers: { 'content-type': 'multipart/form-data'}
		}
		if (onUploadProgress) {
			options.onUploadProgress = onUploadProgress; 
		}
		return axios.post(fullUrl, formData, options);
	}
	static all(...axiosList) {
		return axios.all(axiosList).then(axios.spread(function(...response) {
			return {...response};
		}));
	}
	static defaults = {
		set debug(value) { config.debug = value; },
		get debug() { return config.debug },

		set caching(value) { 
			if (config.offlineMode === false) {
				config.caching = value;
			} else {
				config.caching = true;
			}
			if (config.caching === true) {
				APIMonitor.initialize();
			}
		},
		get caching() { return config.caching; },

		set offlineMode(value) { 
			config.offlineMode = value; 
			if (value === true) {
				this.caching = true;
			}
		},
		get offlineMode() { return config.offlineMode; },

		set timeout(value) { axios.defaults.timeout = value; },
		get timeout() { return axios.defaults.timeout; },

		set hostName(value) { config.hostName = value;},
		get hostName() { return getAPIHost()}
	};
}

if (process.env.NODE_ENV === 'development') {
	axios.interceptors.request.use(
		(req) => {
			if (config.debug === true) {
				console.log('%c Request:', 'color: #4CAF50; font-weight: bold', req);
			}
			return req;
		},
		(err) => {
			if (config.debug === true) {
				console.log('%c Request:', 'color: #EC6060; font-weight: bold', err);
			}
			return Promise.reject(err);
		}
	);
	axios.interceptors.response.use(
		(res) => {
			if (config.debug === true) {
				console.log('%c Response:', 'color: #3d62e5; font-weight: bold', res);
			}
			return res;
		},
		(err) => {
			if (config.debug === true) {
				console.log('%c Response:', 'color: #EC6060; font-weight: bold', err);
			}
			return Promise.reject(err);
		}
	);
}

export default APICaller
export {APIMonitor, APICaller, axios}