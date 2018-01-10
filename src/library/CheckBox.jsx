import React, { Component, PropTypes } from 'react';

export class CheckBox extends Component {
  static contextTypes = {
    checkBoxGroup: PropTypes.object,
    contextController: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      checked : this.props.checked
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(this.state.checked !== nextProps.checked){
      this.setState({
        checked: nextProps.checked
      });
    }
  }
  
  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.checked !== prevProps.checked) {
      let {onDefaultChecked, checked, value} = {...this.props, ...this.context.checkBoxGroup};  
      if (checked && onDefaultChecked) {
        onDefaultChecked(value);
      }
    }
  }

  componentDidMount() {
    let {onDefaultChecked, checked, value} = {...this.props, ...this.context.checkBoxGroup};
    if (checked && onDefaultChecked) {
      onDefaultChecked(value);
    }

    if(this.context && this.context.contextController){
      this.context.contextController.subscribe(()=>{
        this.forceUpdate();
      })
    }
    
  }

  render() {
    let {label, name, onChange, value, selectedValues, id, labels, labelStyle={}, ...rest} = {...this.props, ...this.context.checkBoxGroup};
    let isCheck = false;

    if (rest.onDefaultChecked) {
      delete rest.onDefaultChecked;
    }
    if (rest.checked) {
      delete rest.checked;
    }

    if (this.state.checked) {
      isCheck = true;
    } else if (selectedValues && selectedValues.indexOf(value) !== -1) {
      isCheck = true;
    }

    if (!id) {
      id = name + '_' + value;
    }

    
    if (!label) {
      return <input type="checkbox" name={name} id={id} value={value} onChange={onChange} {...rest} checked={isCheck}/> 
    } else {
      label = {__html:label}
      return (
        <c_>
          <input type="checkbox" name={name} id={id} checked={isCheck} value={value} onChange={onChange} {...rest} /> 
          <label htmlFor={id} style={labelStyle} dangerouslySetInnerHTML={label} ></label>
        </c_>
      );
    }    
  }
}

class ControllContextProvider {
  constructor(selectedValues) {
    this.selectedValues = selectedValues;
    this.subscriptions = [];
    this.setSelectedValues = this.setSelectedValues.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  
  setSelectedValues(selectedValues) {
    this.selectedValues = selectedValues
    this.subscriptions.forEach(f => f())
  }

  subscribe(f) {
    this.subscriptions.push(f)
  }
}


export class CheckBoxGroup extends React.Component{
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onDefaultChecked = this.onDefaultChecked.bind(this);

    const {selectedValues} = this.props;

    this.state = {
      selectedValues: Array.isArray(selectedValues) ? selectedValues : []
    }
    this.contextController = new ControllContextProvider(selectedValues);
  }

  static childContextTypes= {
    checkBoxGroup: PropTypes.object,
    contextController: PropTypes.object,
  }

  getChildContext() {
    const {name} = this.props;
    return {
      checkBoxGroup: {
        name:name,
        onChange: this.onChange,
        onDefaultChecked: this.onDefaultChecked,
        selectedValues: this.contextController.selectedValues,
      },
      contextController:this.contextController
    }
  }

  onChange(e) {
    let selectedValues = [...this.state.selectedValues];
    if(this.props.selectedValues && selectedValues !== this.props.selectedValues){
      selectedValues = this.props.selectedValues 
    }
    if (e.target.checked) {
      selectedValues.push(e.target.value);
    } else {
      let index = selectedValues.indexOf(e.target.value);
      selectedValues.splice(index, 1);
    }
    this.setState({selectedValues});
    this.props.onChange(selectedValues);
  }

  onDefaultChecked(value) {
    let selectedValues = this.state.selectedValues;
    if (selectedValues.indexOf(value) === -1) {
      selectedValues.push(value);
      this.setState({selectedValues});
    }
    this.props.onChange(selectedValues);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.selectedValues) !== JSON.stringify(nextProps.selectedValues) || JSON.stringify(this.state.selectedValues) !== JSON.stringify(nextProps.selectedValues)) {
      this.setState({
        selectedValue:nextProps.selectedValues
      },()=>{
        this.contextController.setSelectedValues(nextProps.selectedValues)
      });
      
    }
  }
  
  render(){
    return this.props.children;
  }
} 

