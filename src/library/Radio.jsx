import React, {PropTypes} from 'react';

export class Radio extends React.Component {
  static contextTypes = {
    radioGroup: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      checked : this.props.checked
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.checked !== nextProps.checked){
      this.setState({
        checked: nextProps.checked
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.checked !== prevProps.checked) {
      let {onDefaultChecked, checked, value} = {...this.props, ...this.context.radioGroup};  
      if (checked && onDefaultChecked) {
        onDefaultChecked(value);
      }
    }
  }

  componentDidMount() {
    let {onDefaultChecked, checked, value} = {...this.props, ...this.context.radioGroup};
    if (checked && onDefaultChecked) {
      onDefaultChecked(value);
    }
  }

  render() {
    let {name, onChange, selectedValue, label, value, id, inputStyle={}, labelStyle={}, ...rest} = {...this.props, ...this.context.radioGroup};
    let isChecked = false;
    
    if (rest.onDefaultChecked) {
      delete rest.onDefaultChecked;
    }
    if (rest.checked) {
      delete rest.checked;
    }

    if (this.state.checked) {
      isChecked = true;
    } else if (selectedValue === value) {
      isChecked = true;
    }

    if (!id) {
      id = name + '_' + value;
    }

    if (!label) {
      return <input type="radio" style={inputStyle} name={name} id={id} value={value} checked={isChecked} onChange={onChange} {...rest} ref={(ref) => {this.radio = ref}} />
    } else {
      return (
        <r_ >
          <input type="radio" style={inputStyle} name={name} id={id} value={value} checked={isChecked} onChange={onChange} {...rest} ref={(ref) => {this.radio = ref}} />
          <label htmlFor={id} style={labelStyle}>{label}</label>
        </r_>
      );
    }
  }
};

export class RadioGroup extends React.Component{
  constructor(props){
    super(props);
    let {selectedValue=''} = this.props
    this.state = {
      selectedValue
    }

    this.onDefaultChecked = this.onDefaultChecked.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static childContextTypes= {
    radioGroup: PropTypes.object,
  }

  getChildContext() {
    const {name} = this.props;
    const {selectedValue} = this.state;
    return {
      radioGroup: {
        name,
        onChange:this.onChange,
        onDefaultChecked:this.onDefaultChecked,
        selectedValue,
      },
    }
  }

  onDefaultChecked(value) {
    this.setState({
      selectedValue: value
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  onChange(e){
    if(!this.props.readOnly){
      this.setState({
        selectedValue:e.target.value
      });
      if (this.props.onChange) {
        this.props.onChange(e.target.value);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.selectedValue !== nextProps.selectedValue){
      this.setState({
        selectedValue : nextProps.selectedValue
      })
    }
  }
  
  render(){
    return this.props.children;
  }
}

export default Radio;