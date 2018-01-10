import React, { Component } from 'react';
import ClassNames from 'classnames';

class Paging extends Component {
  constructor(props){
    super(props);
    let {start = 1, step = 1, selected = 1, type='jump'} = this.props;

    this.state = {
      selected:selected,
      start:start,
      step:step,
      type:type,
    }
  }

  parentComponentSendNo(no){
    this.props.onClick(no);
  }
  
  componentWillReceiveProps(nextProps) {
    let {step} = this.state;
    let isModify = {
      step :false, 
    }
    if(step !== nextProps.step){
      isModify.step = true;
    }

    if(isModify.step){
      this.setState({
        step :isModify.step ? nextProps.step : step
      })
    }

  }
  

  prevNext(command, max){
    let {start, step, type, selected} = this.state;
    let startResult = start;
    let selectedResult = selected;
    switch (command) {
      case 'prev':
        if('jump' === type){
          startResult = start - step > 0 ? start - step : 1;
          selectedResult = start - step > 0 ? startResult + step - 1 : 1;
        }
        else if('step'){
          selectedResult = selected - 1 > 0 ? selected - 1 : 1;
          if(start > selectedResult){
            startResult = start - step;
          }
        }
        break;
      case 'next':
        if('jump' === type){
          startResult = start + step <= max ? start + step : start;
          selectedResult = start + step <= max ? start + step : max;
        }
        else if('step'){
          selectedResult = selected + 1 <= max ? selected + 1 : max;
          if(start + step <= selectedResult){
            startResult = start + step ;
          }
        }
        break;
      default:
        break;
    }
    this.changeStater({start:startResult, step, selected:selectedResult});
  }

  noClick(no){
    let {start, step} = this.state;
    this.changeStater({start, step, selected:no});
  }

  makeArr(start, step, max){
    let arr = [];
    for(let i = start ; i < start + step ; i++){
      if(i <= max){
        arr.push(i);
      }
    }
    return arr;
  }

  changeStater({start, step, selected}){
    this.setState({
      start,
      step,
      selected
    })
    this.parentComponentSendNo(selected);
  }

  getStartIndex(){
    const {selected, step} = this.state;
    return (parseInt(selected/step,10) * step) + 1
  }

  render() {
    let {step, selected} = this.state;
    let {count=1, pageSize=1} = this.props;
    if(count < 1 || pageSize < 1){
      return null
    }
    let max = count / pageSize;
    max = Math.ceil(max)
    //스텝이 맥스보다 크면 맥스를 선택 아니면 스텝 선택
    let decideStep = max < step ? max : step;
    let decideStart = this.getStartIndex()
    let buttonArr = this.makeArr(decideStart, decideStep, max);
    return (
      <div className="page-box">
        <button className="prev" 
          onClick={()=>{ this.prevNext('prev', max) }} />
        <ul>
          {buttonArr.map((item, index)=>{
            return(
              <li key={item} className={ClassNames({'on':item === selected})} onClick={()=>{this.noClick(item)}} >
                <button>{item}</button>
              </li>  
            )
          })}
        </ul>
        <button className="next"  onClick={()=>{ this.prevNext('next', max) }} />
      </div>
    );
  }
}

export default Paging;