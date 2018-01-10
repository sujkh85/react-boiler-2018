import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {parseQueryString} from '../queryrouter/parseQueryString';


class RouterConnection extends Component {
	render() {
		return (
			<Router history={this.props.history} basename={this.props.basename}>
					<Route render={(props) => {
						const newProps = {
							...props,
							location: {
								...props.location,
								query:parseQueryString(props.location.search),
								prevLocation: this.prevLocation
							}
						};
						this.prevLocation = {...props.location, query:parseQueryString(props.location.search)};
						return React.createElement(this.props.component, newProps);
					}}
					/>
			</Router>
		);
	}
}

RouterConnection.propTypes = {
	basename: React.PropTypes.string,
	history: React.PropTypes.object.isRequired
}

RouterConnection.defaultProps = {
	basename: ''
}

export default RouterConnection
