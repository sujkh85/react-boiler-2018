
export default class Environment {
	static type = {
		development: 'development',
		staging: 'staging',
		production: 'production'
	}
	static getType = () => {
		if (process.env.NODE_ENV === 'development') {
			return Environment.type.development
		} else if (process.env.NODE_ENV === 'production') {
			if (location.hostname.toLowerCase().indexOf('wink.co.kr') !== -1) {
				return Environment.type.production
			} else if (location.hostname.toLowerCase().indexOf('danbi.biz') !== -1) {
				return Environment.type.staging;
			}
			return '';
		}
		return '';
	}
}