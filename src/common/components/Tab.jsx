import React, { Component } from 'react';
import ClassNames from 'classnames';

export class StepTab extends Component {
  constructor(props){
    super(props);

    let {selectNo} = this.props;

    this.state = {
      selectNo:selectNo
    }
  }
  render() {
    let {labelArr, onClick} = this.props;
    let {selectNo} = this.state
    return (
      <ul className={`step cell-${labelArr.length}`}>
        {labelArr.map((item, index)=>{
          index++;
          return(
            <li key={index} 
              className={ClassNames({'on':index === selectNo})}
              onClick={(e)=>{
                if(onClick){
                  onClick(e, item, index);
                  this.setState({selectNo:index})
                }
              }}
            >
              <b><small>step</small><em>{index}</em>{'string' === typeof item?  item: item.label}</b>
            </li>
          );
        })}
      </ul>
    );
  }
}

export class BubbleUnderTab extends Component {
  constructor(props){
    super(props);

    let {selectNo} = this.props;

    this.preventDefault = this.preventDefault.bind(this);

    this.state = {
      selectNo:selectNo
    }
  }
  selectType(type){
    switch (type) {
      case 'bubble':
        return 'tab-type';
      case 'underBar':
        return 'tab-type2';
      case 'stepsub':
        return 'step-sub-tab';
      default:
        return 'tab-type';
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.selectNo !== nextProps.selectNo){
      this.setState({
        selectNo:nextProps.selectNo
      })
    }
  }
  
  preventDefault(e){
    e.preventDefault();
  }

  render() {
    let {labelArr, onClick, type, disabled=false} = this.props;
    let {selectNo} = this.state;
    let cellClass = labelArr.length > 3 ? 3 : labelArr.length;

    return (
      <ul className={`${this.selectType(type)} cell-${cellClass}`}>
        {labelArr.map((item, index, location)=>{
          index++;
          return(
            <li key={index} className={ClassNames({'on':index === selectNo})}
              onClick={(e)=>{
                if(onClick){
                  onClick(e, item, index);
                  if(!disabled){
                    this.setState({selectNo:index});
                  }
                }
              }}
            >
              <a href="#" onClick={this.preventDefault}>{'string' === typeof item ? item : item.label}</a>
            </li>
          );
        })}
      </ul>
    );
  }
}