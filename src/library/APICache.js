import IndexedDBUtil from './IndexedDBUtil';
import Session from './Session';
import moment from 'moment';

function defaultPromise() {
	return new Promise((resolve, reject) => {
		resolve(undefined);
	});
}

let firstName = null;
function mergeKey(firstName, url, params) {
	const key = firstName.concat('#', url, '#', (params != null ? JSON.stringify(params) : ''));
	return key;
}

export default class APICache {
	static get status() {
		if (!this._status) {
			return false;
		}
		return this._status;
	}
	static set firstName(value) {
		firstName = value;
	}
	static get firstName() {
		if (firstName === null) {
			return (Session.isLogin === true ? Session.userInfo.actorId.toString() : '');
		} else {
			return firstName;
		}
	}

	static get version() {
		return 1;
	}
	static initialize() {
		this._status = false;
		this.storeName = 'API';
		this.db = new IndexedDBUtil('DanbiEdu', this.version, this.storeName);
		this.open().then(() => {
			this.removeOldData();
		})
	}
	static open() {
		return new Promise((resolve, reject) => {
			this.db.open((db) => {
				if (db.objectStoreNames.contains(this.storeName)) {
					db.deleteObjectStore(this.storeName);
				}
				const store = db.createObjectStore(this.storeName, { keyPath: 'fullUrl' });
				store.createIndex('lastUpdate', 'lastUpdate', { unique:false });
				return true;
			}).then((request) => {
				APICache._status = true;;
				resolve(request);
			}).catch((e) => {
				APICache._status = false;
			});
		});
	}
	static put(url, params, response) {
		if (this._status === false) {
			return defaultPromise();
		}
		const fullUrl = mergeKey(this.firstName, url, params);
		const data=JSON.stringify(response);
		return this.db.put({fullUrl, response:data, lastUpdate:Date.now(), datetime:moment().format()});
	}
	static get(url, params) {
		if (this._status === false) {
			return defaultPromise();
		}
		const fullUrl = mergeKey(this.firstName, url, params);
		return this.db.get(fullUrl).then((data) => {
			let response;
			if (data) {
				response = JSON.parse(data.response);
			}
			return response;
		});
	}
	static removeOldData() {
		if (this._status === false) {
			return defaultPromise();
		}
		var now = new Date(Date.now());
		var month = now.getMonth();
		var to = now.setMonth(month - 1);
		return this.db.removeIndexRange('lastUpdate', to);
	}
}
