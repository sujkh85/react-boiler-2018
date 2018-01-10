import {ActionTypes as types} from './MainAction';
import simpleDotProp from '../library/simpleDotProp';

const initialState = {

}

export default function MainReducer(state = initialState, action) {
	switch(action.type)	 {
		case types.EXCEPTION: 
			return simpleDotProp.set(state, {
				
			});
		default:
			return state;
	}
}