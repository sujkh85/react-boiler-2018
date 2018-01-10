import React, {Component} from 'react';

class Case extends Component {
  render() {
    return this.props.children;
  }
}

class Default extends Component {
  render() {
    return this.props.children;
  }
}

class Switch extends Component {
  getChildrens() {
    let cases, defaultComponent;

    React.Children.forEach(this.props.children, (item) => {
      if (React.isValidElement(item)) {
        if (!cases && item.type === Case) {
          if (this.props.condition === item.props.value) {
            cases = item
          }
        } else if (!defaultComponent && item.type === Default) {
          defaultComponent = item;
        }
      }
    });

    if(!cases){
      if (defaultComponent) {
        return defaultComponent;
      } else {
        return null;
      }
    }
    return cases;
  }

  render() {
    return this.getChildrens()
  }
}

export default Switch;
export {Switch, Case, Default};
