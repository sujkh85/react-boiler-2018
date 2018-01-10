class simpleDotProp {
	static set (obj, valueObj) {
		let result;

		if (typeof obj === 'object') {
			result = {...obj};
			if (!obj) {
					return obj
			} else if (Object.keys(valueObj).length === 0 ) {
				return {...obj};
			}
			Object.keys(valueObj).forEach((key, idx) => {
				if (!valueObj[key] || valueObj[key] === null) {
					result = {...result, [key]: valueObj[key]}
				} else if ( Array.isArray(valueObj[key]) ) {
					result = {...result, [key]: simpleDotProp.deepCopy(valueObj[key])}
				} else if (typeof valueObj[key] === 'object') {
					result = {...result, [key]: simpleDotProp.deepCopy(valueObj[key])}
				} else {
					result = {...result, [key]: valueObj[key]}
				}
			});
			return result;
		}

		return valueObj;
	}

	static deepCopy(obj) {
		let result;
		if (!obj || obj === null) {
			return obj
		} else if (Array.isArray(obj) === true) {
			result = [];
			obj.forEach((value) => {
				if (typeof value === 'undefined' || value === null) {
					result.push([value]);
				} else if (Array.isArray(value) === true) {
					result.push([...simpleDotProp.deepCopy(value)]);
				} else if (typeof value === 'object') {
					result.push({...simpleDotProp.deepCopy(value)});
				} else {
					result.push(value);
				}
			});
			return result;
		} else if (typeof obj === 'object') {
			result = {};
			Object.keys(obj).forEach((key) => {
				if (typeof obj[key] === 'undefined' || obj[key] === null) {
					result[key] = obj[key];
				} else if (Array.isArray(obj[key]) === true) {
					result[key] = [...simpleDotProp.deepCopy(obj[key])];
				} else if (typeof obj[key] === 'object') {
					result[key] = {...simpleDotProp.deepCopy(obj[key])};
				} else {
					result[key] = obj[key];
				}
			});
			return result;
		} else {
			return obj;
		}
	}
}

export default simpleDotProp;