import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {QueryRoute} from '../library/queryrouter';
import Session from '../library/Session';

const AuthRoute = ({component, auth, ...rest}) => {
	return (
		<QueryRoute {...rest} render={(props) => {
				if (Session.isLogin && Session.isLoginToken) {
					if (auth.id) {
						return React.createElement(component, props);
					} else {
						return null
					}
				} else {
					return (<Redirect to={{pathname: '/', search: '?'}}/>);
				}
			}}
		/>
	);
}

const mapStateToProps = (state, ownProps) => {
	return {
		auth: state.MemberReducer.auth
	}
}

export default connect(mapStateToProps)(AuthRoute)