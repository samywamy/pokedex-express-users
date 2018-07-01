var React = require('react');
var LayoutContainer = require('./layout.jsx');

class Login extends React.Component {
  render() {
    return (
    	<LayoutContainer>
	    	<div>
	    		<form action="/login" method="POST">

	    			<input name="email" type="text" placeholder="email" />

	    			<input name="password" type="text" placeholder="password"/>

	    			<input name="submit" type="submit" />
	    		</form>
	    	</div>
    	</LayoutContainer>
    );

  }
}

module.exports = Login;