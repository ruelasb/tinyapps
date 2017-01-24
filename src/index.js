import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';


class CustomTextInput extends React.Component {
	constructor(props){
		super(props);

		this.focus = this.focus.bind(this);
	}

	focus(){
		this.textInput.focus();
	}

	render(){
		return(
			<div>
				<input 
				type="text"
				ref={(input) => this.textInput = input} />
				<input
				  type="button"
				  value="Focus the text input"
				  onClick={this.focus}/>

			</div>
		)
	}

}

class AutoFocusTextInput extends React.Component {
	componentDidMount(){
		this.textInput.focus()
	}
	render(){
		return(
			<CustomTextInput ref={(input) => {this.textInput = input}} />
		)
	}
}

ReactDOM.render(
	<AutoFocusTextInput />,
	document.getElementById('root')
);