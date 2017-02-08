import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';



class ProductCategoryRow extends React.Component {
  render(){
    return (
      <tr>
        <th colSpan="2">{this.props.category}</th>
      </tr>
    )
  }
}

class ProductRow extends React.Component {
  render(){
    var style = this.props.product.stocked ? {color: 'none'} : {color: 'red'};
    return(
      <tr>
        <td style={style}>{this.props.product.name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    )
  }
}

class ProductTable extends React.Component {
  render(){
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach((product) => {
      if(product.name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1 || (!product.stocked && this.props.inStockOnly)){
        return;
      }
      if(product.category !== lastCategory){
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
        console.log(rows);
      }
      rows.push(<ProductRow product={product} key={product.name}/>);
      lastCategory = product.category;
    })

    return(
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class SearchBar extends React.Component {
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(){
    this.props.onUserInput(
      this.filterTextInput.value,
      this.inStockOnlyInput.checked
    );
  }

render(){
  return(
    <form>
      <input 
      type="text" 
      placeholder="Search..." 
      value={this.props.fliterText}
      ref={(input) => this.filterTextInput = input}
      onChange={this.handleChange}/>
      <p>
        <input 
          type="checkbox" 
          checked={this.props.inStockOnly}
          ref={(input) => this.inStockOnlyInput = input}
          onChange={this.handleChange}/>
          {' '}
          Only show products in stock
      </p>
    </form>
  )
}
}

class FilterableProductTable extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      filterText: '',
      inStockOnly: false,
      addProduct: [{category: 'Sporting Goods', price: '$5.99', stocked: true, name: 'Soccerball'},]
    }

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(filterText, inStockOnly){
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    })
  }

  componentWillMount(){
  	const addProduct = this.state.addProduct.slice();
  	this.props.onAdd(addProduct[addProduct.length - 1]);
  }

  sortCategory(a,b){
    var catA = a.category.toLowerCase();
    var catB = b.category.toLowerCase();
    if(catA < catB){
      return 1
    }
    if (catA > catB){
      return -1
    }
      return 0
   }
  
  render(){
    return(
      <div>
        <SearchBar 
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}/>
        <ProductTable 
          products={PRODUCTS.sort(this.sortCategory)} 
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}/>
      </div>
    )
  }
}

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'},
]

function quantify(product){
  PRODUCTS = PRODUCTS.concat(product);
}

ReactDOM.render(
  <FilterableProductTable onAdd={(z) => quantify(z)} />,
  document.getElementById('root')
)


