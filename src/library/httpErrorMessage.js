

function etcMessage(message) {
	if (message) {
		return message;
	} else {
		return '서버 오류가 발생하였습니다. 다시 시도해주세요.'
	}	
}

export default function httpErrorMessage(ex, otherMessage) {
	if (process.env.NODE_ENV !== 'production') {
		console.log(ex);
	} else {
		console.log(ex);
	}
	
	try
	{
		if (ex.response.status >= 400 && ex.response.status < 500) {
			let resultMessage = '';;
			if (Object.keys(ex.response.data).length > 0) {
				Object.keys(ex.response.data).forEach((key) => {
					resultMessage += (resultMessage !== '' ? '<br />' : '') + ex.response.data[key]
				});
				return resultMessage;
			}
		}
	} catch(e) {
		return etcMessage(otherMessage);
	}

	return etcMessage(otherMessage);
}
