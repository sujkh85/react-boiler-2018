import React, { Component } from 'react';
import SpinInjector from '../../../library/spin/SpinInjector';

class WaitContainer extends Component {
  render() {
    return (
      <div className="loading-box loading-box-dim" >
        <p>
          처리중입니다.<br />
          잠시만 기다려 주세요.<br />
          <img src="https://s.wink.co.kr/app/parents/images/img_loading.png" alt="" className="loading" />
        </p>
      </div>
    );
  }
}

export default SpinInjector(WaitContainer);
