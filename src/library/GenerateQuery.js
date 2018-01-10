export function generateQuery(query) {
	if (!query || query === null) {
		return {};
	}
	let queryString = '';
	for(let key of Object.keys(query)) {
		if (query.hasOwnProperty(key)) {
			if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
				if (query[key] instanceof Array) {
					if (query[key].length > 0) {
						if (queryString !== '') {
							queryString += '&';
						}
						queryString = queryString.concat(key, '=' + query[key]);	
					}
				} else {
					if (queryString !== '') {
						queryString += '&';
					}
					queryString = queryString.concat(key, '=' + query[key]);
				}
			}
		}
	}
	return '?'.concat(queryString);
}

export function generateURL(url, query) {
	if (!query || query === null) {
		return url;
	}
	let queryString = generateQuery(query);
	if (url.indexOf('?') !== -1) {
		queryString = queryString.replace('?', '&');
		url = url.concat('?', queryString);
	} else {
		url = url.concat(queryString);
	}
	return url;
}