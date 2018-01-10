export default function(name, ...params) {
	if (!name || !params) {
		return false;
	}
	for(var i = 0; i < params.length; i++) {
		if (name.substr(0, params[i].length) === params[i]) {
			return true;
		}
	}
	return false;
}