import { combineReducers } from 'redux';
import ExceptionReducer from '../library/error/ExceptionReducer';
import MainReducer from '../main/MainReducer'

export default combineReducers({
	MainReducer,
	ExceptionReducer
});
