import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

/****** Square Component - START *******/
/**************************************/

function Square(props) {
    return (
      <button 
        className="square" 
        onClick={() => props.onClick()}
        style={props.winningLine}>
        {props.value}
      </button>
    );
}

/****** Board Component - START *******/
/**************************************/

class Board extends React.Component {

    //// Makes nine calls to the Square stateless function.
	renderSquare(squareCounter, highlight) {
	  return <Square 
			   key={squareCounter} 
			   value={this.props.squares[squareCounter]} 
			   onClick={() => this.props.onClick(squareCounter)}
			   winningLine={highlight}
		     />;
	}

    //// Loops to construct three divs that contain three single squares each (9 total calls to renderSquare method). 
	gridBuilder(){
	var divContainer = [];
	var renderSquareContainer = [];
	  for (var row = 0; row < 3; row++) {
		for (var i = 0; i < 3; i++) {
		  var enumerator = (row*3)+i;//enumerates numbers from 1-9 and serves as the key in renderSquare.
		    if (this.props.winningLine){
		    //if the winning line matches the key number then add the highlight.	
		      var highlight = this.props.winningLine[i] === enumerator ? {backgroundColor: 'red'} : {backgroundColor: 'none'};
		    }
		  renderSquareContainer.push(this.renderSquare(enumerator, highlight))//fill container with 3 calls.
		}
		divContainer.push(<div key={row} className="board-row">{renderSquareContainer}</div>);
		renderSquareContainer = [];//clear container for next 3 calls.
	  }
	return divContainer
	}

	render() {
	  return (
	    <div>
	      <div className="status">{status}</div>
	      {this.gridBuilder()}
	    </div>
	  );
	}

}



/****** Game Component - START *******/
/**************************************/

class Game extends React.Component {

	constructor(){
	  super();
	  this.state = {
	    history: [{squares: Array(9).fill(null)}],
	    xIsNext: true,
	    stepNumber: 0
	  };
	}

	//// Set new squares array to history, switch individual square values to 'X' or 'O', and update stepNumber.
	handleClick(i) {
	  const history = this.state.history.slice(0, this.state.stepNumber + 1);
	  const current = history[this.state.stepNumber];
	  const squares = current.squares.slice();
	  //Do nothing if there is a winner or if user clicks on an already clicked square.
	  if (calculateWinner(squares) || squares[i]){ return; }
	  squares[i] = this.state.xIsNext ? 'X' : 'O';
	  this.setState({
		history: history.concat([{
			squares: squares
		}]),
		xIsNext: !this.state.xIsNext,
		stepNumber: history.length,
	  })
	}

	//// Navigate through previous moves on anchor tag click.
	jumpTo(step){
	  this.setState({
		stepNumber: step,
		xIsNext: (step % 2) ? false : true,
	  })
	}

	//// Navigate through previous moves on button click.
	toggleTo(toggle){

	  if(toggle){
		//UP Button--only move up if there is history.
		if (this.state.stepNumber !== 0){var stepNumber = this.state.stepNumber - 1;} else {return}
	  } else {
		//DOWN Button--only move down if there is history.
		if(this.state.stepNumber < this.state.history.length-1){var stepNumber = this.state.stepNumber + 1;	} else {return}
	  }

	  this.setState({
	    stepNumber: stepNumber,
	    xIsNext: (stepNumber % 2) ? false : true,
	  })
	}


	render() {
	  const history = this.state.history;
	  const current = history[this.state.stepNumber];
	  const winner = calculateWinner(current.squares);

	  let status;
	  if (winner) {
	    status = 'Winner: ' + current.squares[winner[0]];
	  } else {
	    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	  }

	  //Create move history ordered list.
	  const moves = history.map((step, move) => {
	    var desc = move ? 'Move #' + move : 'Game start';
	    //Determins where you are on the list.
	    if (move === this.state.stepNumber){ desc = <b>{desc}</b> };
	    return (
	      <li key={move}>
	        <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
	      </li>
	    );
	  });

	  return (
	    <div className="game">
	      <div className="game-board">
	        <Board 
	        squares={current.squares}
	        onClick={(i) => this.handleClick(i)} 
	        winningLine={winner}/>
	      </div>
	      <div className="game-info">
	      <div>{status}</div>
	        <button onClick={() => this.toggleTo(true)}>UP</button>
	        <button onClick={() => this.toggleTo(false)}>DOWN</button>
	        <button onClick={() => this.setState({history: [{squares: Array(9).fill(null)}], xIsNext: true, stepNumber: 0})}>Reset</button>
	      <ol>{moves}</ol>
	    </div>
	  </div>
	  );
	}
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

