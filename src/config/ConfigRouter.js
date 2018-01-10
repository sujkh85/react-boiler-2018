import React from 'react';
import {QuerySwitch, QueryRoute} from '../library/queryrouter/';
import MainContainer from '../main/MainContainer';
import PageNotFound from '../error/PageNotFound';
import PageNotConnect from '../error/PageNotConnect';

const ConfigRouter = (props) => {
	return(
		<QuerySwitch {...props} queryname="pagename">
		  <QueryRoute {...props} component={MainContainer} />
			<QueryRoute path="main" component={MainContainer} />
			<QueryRoute path="notconnect" component={PageNotConnect}/>
			<QueryRoute nomatch component={PageNotFound}/>
		</QuerySwitch>
	)
}

export default ConfigRouter;
