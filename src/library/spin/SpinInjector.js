import React, { Component } from 'react';
import {EventName} from './EventName';

export default function SpinInjector(WrappedComponent) {
  return class Enhancer extends Component {
    constructor(props){
      super(props);

      this.state = {
        isShow : false
      }

      this.isSpinShow = false;
      this.apiCallCount = 0;

      this.onApiCall = this.onApiCall.bind(this);
      this.onSpin = this.onSpin.bind(this);

      this.loadTimer = null;
      this.delayTimer = null;
      this.expireTimer = null;
      this.firstTimer = null;

      this.timer = 20000;
    }

    onApiCall(e) {
      const apiEvent = {
        request: () => {
          if (this.isSpinShow === true) {
            if (this.firstTimer) {
              clearTimeout(this.firstTimer);
              this.firstTimer = null;
            }
            this.apiCallCount ++;
            if (this.expireTimer) {
              clearTimeout(this.expireTimer);
              this.expireTimer = null;
            }
            if (!this.loadTimer && this.apiCallCount === 1 && this.state.isShow === false) {
              this.loadTimer = setTimeout(() => {
                this.loadTimer = null;
                this.setState({isShow: true})
              }, 10);
            }
            if (this.delayTimer) {
              clearTimeout(this.delayTimer);
              this.delayTimer = null;
            }
            this.delayTimer = setTimeout(() => {
              this.apiCallCount = 0;
              this.isSpinShow = false;
              this.setState({isShow: false});
              clearTimeout(this.delayTimer);
              this.delayTimer = null;
            }, this.timer);
          }
        },

        requestShowSpin: () => {
          if (this.isSpinShow === false) {
            this.isSpinShow = true;
          }
          apiEvent.request();
        },

        requestError: () => {},
        
        response: () => {
          if (this.isSpinShow === true) {
            this.apiCallCount --;
            if (this.apiCallCount === 0 && this.state.isShow  === true) {
              if (this.expireTimer) {
                clearTimeout(this.expireTimer);
                this.expireTimer = null;
              }
              this.expireTimer = setTimeout(() => {
                this.apiCallCount = 0;
                this.isSpinShow = false;
                this.setState({isShow: false});
                if (this.delayTimer) {
                  clearTimeout(this.delayTimer);
                  this.delayTimer = null;
                }
              }, 200);
            }
          }
        },
        responseError: () => {
          apiEvent.response();
        }
      }

      const {type} = e.detail;
      if (type && apiEvent[type]) {
        apiEvent[type]();
      }
    }

    onSpin(e) {
      const spinEvent = {
        showSpin: (delay = 200) => {
          if (this.isSpinShow === false) {
            this.apiCallCount = 0;
            this.timer = e.detail.timer
            this.isSpinShow = true;

            this.firstTimer = setTimeout(() => {
              if (this.apiCallCount === 0) {
                this.isSpinShow = false;
              }
            }, delay);
          }
        },
        hideSpin: () => {
          if (this.isSpinShow === true) {
            this.apiCallCount = 0;
            this.isSpinShow = false;
          }
        },
        clearSpin: () => {
          this.apiCallCount = 0;
          this.isSpinShow = false;
        }
      }
      const {type} = e.detail;
      if (type && spinEvent[type]) {
        spinEvent[type]();
      }
    }

    componentWillMount() {
      window.addEventListener(EventName.api_call,this.onApiCall, false);
      window.addEventListener(EventName.show_spin, this.onSpin, false);
      window.addEventListener(EventName.hide_spin, this.onSpin, false);
      window.addEventListener(EventName.clear_spin, this.onSpin, false);
    }

    componentWillUnmount() {
      window.removeEventListener(EventName.api_call,this.onApiCall, false);
      window.removeEventListener(EventName.show_spin, this.onSpin, false);
      window.removeEventListener(EventName.hide_spin, this.onSpin, false);
      window.removeEventListener(EventName.clear_spin, this.onSpin, false);
    }

    render() {
      if (this.state.isShow === true) {
        return <WrappedComponent {...this.props}/>
      } else {
        return null;
      }
    }
  }
}