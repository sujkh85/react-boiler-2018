import React, { Component } from 'react';
import LoginInjector from './LoginInjector';

class AuthContainer extends Component {
  render() {
    const {actorId, postInfo} = this.props;
    if(actorId && postInfo){
      if (this.props.actorId !== this.props.postInfo.actor) {
        return null;
      }
    }
    return React.cloneElement(this.props.children);
  }
}

export default LoginInjector(AuthContainer);