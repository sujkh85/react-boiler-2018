import React, { Component } from 'react';
import ExceptionInjector from '../library/error/ExceptionInjector';

class PageNotConnect extends Component {
  render() {
    return (
      <div id="wrap" style={{height:'100vh'}}>

      </div>
    );
  }
}

export default ExceptionInjector()(PageNotConnect);