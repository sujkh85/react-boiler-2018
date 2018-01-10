import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class SlideUpDownAni extends Component {
	static defaultProps = {
		duration: '0.5s',
		isDown: true,
		timing: 'ease',
		defaultStyle: '',
		isReady: false
	}

	constructor(props) {
		super(props);

		this.state = {
			updown: ''
		}

		this.transitionEnd = this.transitionEnd.bind(this);
		this.isAnimation = false;
	}

	transition(child, startHeight, endHeight, maxHeight) {
		child.style.overflow = 'hidden';
		child.style.height = startHeight + 'px';
		child.style.minHeight = '0px';
		child.style.maxHeight = maxHeight + 'px';
		child.style.transitionProperty = 'height';
		child.style.transitionDuration = this.props.duration;
		child.style.transitionTimingFunction = this.props.timing;

		setTimeout(() => { 
			child.style.height = endHeight + 'px'; 
		});
	}

	slideUp() {
		const child = ReactDOM.findDOMNode(this);
		if (this.isAnimation === true) {
			child.removeEventListener('transitionend', this.transitionEnd);
		}
		child.style.display = '';
		const height = child.children[0].clientHeight;
		this.transition(child, height, 0, height);
		this.isAnimation = true;
		child.addEventListener('transitionend', this.transitionEnd);
	}

	slideDown() {
		const child = ReactDOM.findDOMNode(this);
		if (this.isAnimation === true) {
			child.removeEventListener('transitionend', this.transitionEnd);
		}
		child.style.display = '';
		const height = child.children[0].clientHeight;
		if (this.props.isReady === false) {
			this.transition(child, 0, height, height);
		} else {
			child.style.overflow = 'hidden';
			child.style.height = '0px';
		}
		this.isAnimation = true;
		child.addEventListener('transitionend', this.transitionEnd);
	}

	transitionEnd(e) {
		this.isAnimation = false;
		const child = ReactDOM.findDOMNode(this);
		child.removeEventListener('transitionend', this.transitionEnd);
		child.removeAttribute('style');
		this.getDefaultStyle(child, this.props.defaultStyle);
		//child.style = this.props.defaultStyle;
		if (this.state.updown === 'up') {
			child.style.display = 'none';
		}
		this.setState({
			updown: ''
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isDown !== nextProps.isDown) {
			this.setState({
				updown: nextProps.isDown ? 'down' : 'up'
			});
		} else if (this.props.resize !== nextProps.resize) {
			if (this.state.updown === '') {
				this.setState({
					updown: 'down'
				});
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.updown !== '') {
			if (this.state.updown === 'down') {
				this.slideDown();
			} else {
				this.slideUp();
			}
		} else {
			if (prevState.updown !== '') {
				if (this.props.onUpDown) {
					this.props.onUpDown(prevState.updown);
				}
			}
		}
	}

	getDefaultStyle(child, defaultStyle){
		const arrStyle = defaultStyle.split(';');
		arrStyle.forEach((item)=>{
			const keyValue = item.split(':');
			if(keyValue.length === 2){
				child.style[keyValue[0]] = keyValue[1];
			}
		})
	}

	componentDidMount() {
		let child = ReactDOM.findDOMNode(this);
		this.getDefaultStyle(child, this.props.defaultStyle);
		// const arrStyle = this.props.defaultStyle.split(';');
		// arrStyle.forEach((item)=>{
		// 	const keyValue = item.split(':');
		// 	if(keyValue.length === 2){
		// 		child.style[keyValue[0]] = keyValue[1];
		// 	}
		// })
		//child.style = this.props.defaultStyle;
		if(!this.props.isDown){
			child.style.display = 'none';
		}
	}

	render() {
		return <div>{this.props.children}</div>;
	}
}

export default SlideUpDownAni;
