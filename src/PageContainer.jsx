import React, { Component } from 'react';
import { LayerPopupContainer } from './library/layerpopup';
import ConfigRouter from './config/ConfigRouter';
import ExceptionContainer from './error/ExceptionContainer';
import WaitContainer from './common/components/waitcircle/WaitContainer';
import SpinController from './library/spin/SpinController';

class PageContainer extends Component {
	constructor(props) {
		super(props);

		this.reloadTime = '';
	}

	componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.search !== this.props.location.search) {
			window.scrollTo(0, 0);
		}
	}	

	componentDidMount() {
		SpinController.showSpin();
	}

	render() {
		return (
			<div>
				<ConfigRouter {...this.props} />			
				<LayerPopupContainer {...this.props}/>
				<ExceptionContainer {...this.props}/>
				<WaitContainer />
			</div>
		);
	}
}

export default PageContainer;
