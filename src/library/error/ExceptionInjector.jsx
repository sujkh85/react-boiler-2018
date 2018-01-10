import { connect } from 'react-redux';
import * as ExceptionAction from './ExceptionAction';

const ExceptionInjector = (stateToProps = null, dispatchToProps = null) => (WrapperComponent) => {
	const mapStateToProps = (state, ownProps) => {
		let props = {};
		if (stateToProps !== null) {
			props = stateToProps(state, ownProps);
		}
		return {
      ex : state.ExceptionReducer.ex,
			message : state.ExceptionReducer.message,
			command : state.ExceptionReducer.command,
			...props
		};
	}

	const mapDispatchToProps = (dispatch, ownProps) => {
		let props = {};
		if (dispatchToProps !== null){
			props = dispatchToProps(dispatch, ownProps);
		}
		return {
			clearException: () => {
				dispatch(ExceptionAction.clearException());
			},
			exception: (e, message) => {
				dispatch(ExceptionAction.exception(e, message));
			},
			...props
		}
	}
	return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
}

export default ExceptionInjector;