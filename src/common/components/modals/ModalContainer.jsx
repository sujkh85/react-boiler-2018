import React, { Component } from 'react';

class ModalContainer extends Component {
	constructor(props) {
		super(props);

		this.scrollY = 0;
	}

	componentWillMount() {
		this.scrollY = window.scrollY;
	}

	componentWillUnmount() {
		const html = document.querySelector('html');
		const body = document.querySelector('body');
		html.classList.remove('non-scroll');
		body.classList.remove('non-scroll');

		setTimeout(() => {
			//document.querySelector('#ParentWrapper').removeAttribute('style');
			window.scrollTo(0, this.scrollY);
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const html = document.querySelector('html')
		const body = document.querySelector('body')
		html.classList.add('non-scroll');
		body.classList.add('non-scroll');
		//document.querySelector('#ParentWrapper').style.width = '100vw';
	}

	componentDidMount() {
		const html = document.querySelector('html')
		const body = document.querySelector('body')
		html.classList.add('non-scroll');
		body.classList.add('non-scroll');
		//document.querySelector('#ParentWrapper').style.width = '100vw';
		// document.querySelector('#ParentWrapper').style.position = 'fixed'
		// document.querySelector('#ParentWrapper').style.top = -this.scrollY + 'px';
	}
	
	render() {
		const newProps = {
			location: this.props.location,
			history: this.props.history,
			layerKey: this.props.layerKey,
			layerCount: this.props.layerCount
		}
		return (
			<section id="lay-wrap" className="view-layer" style={{zIndex:this.props.layerKey, width:'102%'}} ref={(ref) => this.divContainer = ref}>
				{React.cloneElement(this.props.children, newProps)}	
				<div className="dim">&nbsp;</div>
			</section>
		);
	}
}

export default ModalContainer;