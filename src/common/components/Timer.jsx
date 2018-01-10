import React, { Component } from 'react';
import moment from 'moment';
import {CertificationTime} from '../../library/constants/Constants';

class Timer extends Component {
  constructor(props){
    super(props);
    
    let {countTime = CertificationTime} = this.props;

    this.state = {
      countTime:countTime
    }
  }

  componentWillUnmount(){
    this.deleteInterval();
  }

  componentDidMount(){
    if(this.props.on){
      this.runInterval();
    }
  }

  runInterval(){
    let {timeoutCallback} = this.props;
    this.deleteInterval();

    this.interval = setInterval(()=>{
      let {countTime} = this.state;
      
      if(countTime > 0){
        this.setState({
          countTime:countTime - 1000
        })
      }
      else{
        if(timeoutCallback){
          timeoutCallback();
        }
        clearInterval(this.interval);
      }
    }, 1000);
  }

  deleteInterval(){
    if(this.interval){
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.resetId !== nextProps.resetId){
      let {countTime = CertificationTime} = this.props;
      this.runInterval();
      this.setState({
        resetId : nextProps.resetId,
        countTime :countTime
      })
    }
    if(nextProps.on){
      if(this.state.countTime > 0){
        this.runInterval();
      }
    }
    else{
      this.deleteInterval();
    }
  }

  render() {
    let {label='유효시간', format='mm:ss'} = this.props;

    return (
      <span onClick={(e)=>{if(this.props.onClick){this.props.onClick(e)}}}>
        {label} 
        <em>
          {moment(this.state.countTime).format(format)}
        </em>
      </span>
    );
  }
}

export default Timer;