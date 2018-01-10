import React, { Component } from 'react';
import {connect} from 'react-redux';
import Session from '../library/Session';

const LoginInjector = (WrapperComponent) => {
	const mapStateToProps = (state, ownProps) => {
		return {
			student: state.MemberReducer.student,
			actor: state.MemberReducer.actor
		}
	}

	return connect(mapStateToProps)(class extends Component {
		render() {
			let isLogin = false;
			if (this.props.actor && this.props.actor.id) {
				isLogin = true;
			}
			const userInfo = {
				isLogin: isLogin,
				humanName: isLogin ? Session.userInfo.humanName : null,
				userName: isLogin ? Session.userInfo.userName : null,
				actorId: isLogin ? parseInt(Session.userInfo.actorId, 10) : null,
				actorType: isLogin ? Session.userInfo.actorType : null,
				familyId: isLogin ? parseInt(Session.userInfo.params.familyId, 10) : null,
				studentId: this.props.student ? this.props.student.id : null
			}
			const newProps = {...this.props, userInfo:{...userInfo}};
			return (<WrapperComponent {...newProps}/>)
		}
	});
}

export default LoginInjector;