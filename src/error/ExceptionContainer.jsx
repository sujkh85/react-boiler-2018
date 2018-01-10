	import { Component } from 'react';
import ExceptionInjector from '../library/error/ExceptionInjector';
import ButtonBlockUtil from '../library/util/ButtonBlockUtil';

class ExceptionContainer extends Component {
	ButtonBlockUtil = new ButtonBlockUtil();
	componentDidUpdate(prevProps, prevState) {
		const { ex } = this.props;
    if (ex) {
			if(ex.response && ex.response.status >= 400 && ex.response.status < 500){
				//400 ~ 499 error
			} else if(ex.response && ex.response.status >= 500){
				//500 ~ error
				if(this.ButtonBlockUtil.isBlocking()){
					return 
				}
				this.props.history.push('/?pagename=notconnect/notconnect')
			}
    }
  }

  render() {
    return null;
  }
}

export default ExceptionInjector()(ExceptionContainer)
