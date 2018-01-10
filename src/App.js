import React from 'react';
import {Provider} from 'react-redux';
import axios from 'axios';
import createHistory from 'history/createBrowserHistory';
import RouterConnection from './library/routerconnection/RouterConnection';
import ConfigStore from './config/ConfigStore';
import APICaller, {APIMonitor} from './library/APICaller';
//import APICache from './library/APICache';
import PageContainer from './PageContainer';
import SpinController from './library/spin/SpinController';

//한국시간때로 지정
import moment from 'moment';
moment.locale('ko');

APIMonitor.defaults.healthCheckTime = 10000;  // 10s
APICaller.defaults.caching = false;
APICaller.defaults.offlineMode = false;
APICaller.defaults.debug = false;
APICaller.defaults.timeout = 60000; // 5s

export const store = ConfigStore()
const history = createHistory();

axios.interceptors.request.use(
	SpinController.request,
	SpinController.requestError
);
axios.interceptors.response.use(
	SpinController.response,
	SpinController.responseError
);

const App = () => {
  return (
		<Provider store={store}>
			<RouterConnection
				history={history}
				basename={process.env.PUBLIC_URL}
				component={PageContainer}
			/>
		</Provider>
  );
};

export default App;
