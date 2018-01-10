import React, { Component } from 'react';
import {QuerySwitch, QueryRoute} from '../library/queryrouter/';
import Main from './Main';
import PageNotFound from '../error/PageNotFound';

class MemberRouter extends Component {
	render() {
		return (
			<QuerySwitch {...this.props} queryname="pagename">
				<QueryRoute exact component={Main}/>
				<QueryRoute path="main/main" exact component={Main}/>
				<QueryRoute nomatch component={PageNotFound}/>
			</QuerySwitch>
		);
	}
}

export default MemberRouter;