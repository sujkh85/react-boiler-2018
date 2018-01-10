import React, { Component } from 'react';
import ClassNames from 'classnames';

class SelectBox extends Component {
  constructor(props){
    super(props);
    let {mainStyles={}, labelFrameStyles={}, labelCellStyles={}, labelCellButtonStyles={}, defaultSelected='선택'} = this.props;
    this.state = {
      isOn:false,
      mainStyles:mainStyles,
      labelFrameStyles:labelFrameStyles,
      labelCellStyles:labelCellStyles,
      labelCellButtonStyles:labelCellButtonStyles,
      selected:defaultSelected,
      defaultSelected:defaultSelected,
      isRefresh:false
    };
    this.onSelect = this.onSelect.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.onClickButton = this.onClickButton.bind(this);
    this.onBlurButton = this.onBlurButton.bind(this);
    this.handleClickOut = this.handleClickOut.bind(this);
  }

  onSelect(selected){
    let {onSelected} = this.props;
    let targetLabel = this.getLabel(selected)
    this.setState({
      selected:targetLabel,
    },()=>{
      if(onSelected){
        onSelected(selected);
      }
    })
  }

  getLabel(item){
    let targetLabel  = '';
    if('string' === typeof item){
      targetLabel = item;
    }
    if('object' === typeof item){
      if(item.hasOwnProperty('name')){
        targetLabel = item.name;
      }
      else if(item.hasOwnProperty('label')){
        targetLabel = item.label;
      }
    }
    
    return targetLabel;
  }

  handleClickOut(event){
    if(event.target !== this.refButton) { // Actually more complicated, event.target can be a child of button (icon, span, etc)
      this.onBlurButton();
    }
  } 

  onClickButton(){
    const {isOn} = this.state;
    const {disabled=false} = this.props;
    if(!disabled){
      this.setState({isOn:!isOn});
    }
    else{
      if(this.state.isOn){
        this.setState({
          isOn:false
        })
      }
    }
  }

  onBlurButton(){
    this.setTimeoutButton = setTimeout(()=>{
      this.setState({isOn:false})  
    }, 100);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleClickOut, false);
  }

  componentWillUnmount(){
    clearTimeout(this.setTimeoutButton);
    document.body.removeEventListener('click', this.handleClickOut, false);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.defaultSelected !== nextProps.defaultSelected){
      let select = nextProps.defaultSelected ? nextProps.defaultSelected : '선택';
      this.setState({
        defaultSelected:select,
        selected:select
      })
    }
    else if(this.props.labels.length !== nextProps.labels.length){
      if(0 !== this.props.labels.length && 0 !== nextProps.labels.length){
        if(this.props.labels[0].id !== nextProps.labels[0].id){
          this.setState({
            selected:'선택'
          })
        }
      }
    }
  }
  
  render() {
    let {isOn, mainStyles, labelFrameStyles, labelCellStyles, labelCellButtonStyles, selected} = this.state;
    const {labels=[]} = this.props;
    return (
      <div className={ClassNames("select-mode", {"on":isOn})} style={mainStyles}>
        <button onClick={this.onClickButton} ref={(ref)=>{this.refButton = ref}}>
          {selected}
        </button>
        <div style={labelFrameStyles}>
          <ul>
            {labels && Array.isArray(this.props.labels) && 
            (labels.map((item, index)=>{
              let targetLabel = this.getLabel(item);
              return(
                <li key={index} style={labelCellStyles} onClick={()=>{ this.onSelect(item);}}>
                  <button style={labelCellButtonStyles}>{targetLabel}</button>
                </li>
              )
            })
            )}
          </ul>
        </div>
        {isOn ? <span className="shadow"></span> : null}
      </div>
    );
  }
}

export default SelectBox;