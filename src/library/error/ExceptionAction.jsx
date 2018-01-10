import httpErrorMessage from '../httpErrorMessage';

export const ActionTypes = Object.freeze({
	CLEAR_EXCEPTION: 'CLEAR_EXCEPTION',
	EXCEPTION: 'EXCEPTION',
});

export function clearException() {
	return {
		type: ActionTypes.CLEAR_EXCEPTION
	}
}

export function exception(e, message, command = false) {
	return (dispatch, getState)=>{
		if (getState().ExceptionReducer.ex === null){
			return dispatch({
				type: ActionTypes.EXCEPTION,
				payload:{
					ex: e,
					message : httpErrorMessage(e, message),
					command:command ? command : 'alert'
				}
			})
		}
	}
}

export function goMainException(e, message){
	return (dispatch, getState)=>{
		if (getState().ExceptionReducer.ex === null){
			return dispatch({
				type: ActionTypes.EXCEPTION,
				payload:{
					ex: e,
					message : httpErrorMessage(e, message),
					command:'gomain'
				}
			})
		}
	}
}