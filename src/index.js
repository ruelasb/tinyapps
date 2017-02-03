import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

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

class Board extends React.Component {
  renderSquare(i, u, highlight) {
    return <Square 
    		unique={u} 
    		key={u} 
    		value={this.props.squares[i]} 
    		onClick={() => this.props.onClick(i)}
    		winningLine={highlight}/>;
  }

loop(){
	var row = [];
	var next = [];
	for (var i = 0; i < 3; i++) {
	  for (var y = 0; y < 3; y++) {
	  	var z = (i*3)+y;
	  	  if (this.props.winningLine !== null){
			  var highlight = this.props.winningLine[y] === z ? {backgroundColor: 'red'} : {backgroundColor: 'none'};
		  }
		next.push(this.renderSquare(z, z, highlight))
	  }
		row.push(<div key={i} className="board-row">{next}</div>);
		next = [];
	}
	return row
}

  render() {

    return (
      <div>
        <div className="status">{status}</div>
        {this.loop()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(){
  	super();
  	this.state = {
  		history: [{squares: Array(9).fill(null)}],
  		xIsNext: true,
  		stepNumber: 0
  	};
  }

  handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[this.state.stepNumber];
  	const squares = current.squares.slice();
  	if (calculateWinner(squares) || squares[i]){
  		return;
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	this.setState({
  		history: history.concat([{
  			squares: squares
  		}]),
  		xIsNext: !this.state.xIsNext,
  		stepNumber: history.length,
  	})
  }

  jumpTo(step){
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) ? false : true,
  	})
  }

  toggleTo(toggle){
  	if(toggle){
  		if (this.state.stepNumber !== 0){var stepNumber = this.state.stepNumber - 1;}else{return}
  	} else {
  		if(this.state.stepNumber < this.state.history.length-1){
  		var stepNumber = this.state.stepNumber + 1;	
  	}else{return}
  		
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

  	const moves = history.map((step, move) => {
  		var desc = move ? 'Move #' + move : 'Game start';
  		if (move === this.state.stepNumber){
  			desc = <b>{desc}</b>
  		}
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

