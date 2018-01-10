import {ActionTypes as types} from './ExceptionAction';

const initialState = {
  ex: null,
	message: '',
	command:'',
}

export default function ExceptionReducer(state = initialState, action) {
	switch(action.type) {
    case types.CLEAR_EXCEPTION:
			return {...state, 
				ex: null,
				message:initialState.message,
				command:''
			};
		case types.EXCEPTION:
      return {...state,
        ex: action.payload.ex,
				message: action.payload.message,
				command:action.payload.command,
			};
		default:
			return state;
	}
}