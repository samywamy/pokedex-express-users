var React = require('react');
var LayoutContainer = require('./layout.jsx');

class Register extends React.Component {
  render() {
    return (
    	<LayoutContainer>
	    	<div>
	    		<form action="/register" method="POST">
	    			<input name="email" type="text" placeholder="email" />
	    			<input name="password" type="text" placeholder="password"/>
	    			<input name="submit" type="submit" />
	    		</form>
	    	</div>
    	</LayoutContainer>
    );

  }
}

module.exports = Register;