import React, { Component } from 'react';
import { withRouter } from 'react-router';

class LayerContainer extends Component {
	componentWillMount() {
		this.scrollY = window.scrollY;

	}

	componentDidMount() {
		if(!this.props.option || !this.props.option.isDontTouchScroll){
			// const html = document.querySelector('html');
			// const body = document.querySelector('body');
			
			// html.classList.add('non-scroll');
			// body.classList.add('non-scroll');

			// document.querySelector('#ParentWrapper').style.position = 'fixed'
			// document.querySelector('#ParentWrapper').style.top = -this.scrollY + 'px';
		}

		const parentWrapper = document.querySelector('#ParentWrapper');
		parentWrapper.style.display = 'none';
	}


	componentDidUpdate(prevProps, prevState) {
		if(!this.props.option || !this.props.option.isDontTouchScroll){
			// const html = document.querySelector('html');
			// const body = document.querySelector('body');
			// html.classList.add('non-scroll');
			// body.classList.add('non-scroll');
		}
		const parentWrapper = document.querySelector('#ParentWrapper');
		parentWrapper.style.display = 'none';
	}

	componentWillUnmount() {
		if(!this.props.option || !this.props.option.isDontTouchScroll){
			// const html = document.querySelector('html');
			// const body = document.querySelector('body');
			// html.classList.remove('non-scroll');
			// body.classList.remove('non-scroll');
		}
		setTimeout(() => {
			document.querySelector('#ParentWrapper').style.display = 'block';
			window.scrollTo(0, this.scrollY);
		});
	}
	
	render() {
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		const newProps = {
			location: this.props.location,
			history: this.props.history,
			layerKey: this.props.layerKey,
			layerCount: this.props.layerCount
		}
		
		return (
			<div style={{width:screenWidth, height:screenHeight, overflowY:'auto', zIndex:this.props.layerKey}} id="modalContainerScroll" ref={(ref) => this.divContainer = ref}>
				{React.cloneElement(this.props.children, newProps)}	
			</div>
		);
	}
}

export default withRouter(LayerContainer);