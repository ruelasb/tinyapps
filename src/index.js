import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'},
]

function merge(left, right, arr) {
    
  var a=0;
    
  while (left.length && right.length)
    arr[a++] = right[0].category < left[0].category ? right.shift() : left.shift();
    
  while (left.length) arr[a++]=left.shift();
  while (right.length) arr[a++]=right.shift();
    
    return arr;
}


function mSort(arr, tmp, l) {
    
  if(l==1) return;
    
  var m = Math.floor(l/2),
    tmp_l = tmp.slice(0,m),
    tmp_r = tmp.slice(m);
    
    // Note: just uncomment these two lines to make the classic mergeSort work again.
    //
   mSort(tmp_l, arr.slice(0,m), m);
   mSort(tmp_r, arr.slice(m), l-m);

    // Note: just uncomment these two lines to make a "mergequick" implementation.
    //
    //tmp_l = quickSort(arr.slice(0,m));
    //tmp_r = quickSort(arr.slice(m));
    
  return merge(tmp_l, tmp_r, arr);
}

/**
* The mergesort prep and call in a one-line function.  Taken from: http://rosettacode.org/wiki/Sorting_algorithms/Merge_sort#JavaScript
*/
function mergeSort(arr){
  return mSort(arr, arr.slice(), arr.length);
}


function quantify(product){
  PRODUCTS = PRODUCTS.concat(product);
}

/*--------------------*/

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
  	}

  	this.handleUserInput = this.handleUserInput.bind(this);
  }
  handleUserInput(filterText, inStockOnly){
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    })
  }
  render(){
    return(
      <div>
        <SearchBar 
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}/>
        <ProductTable 
          products={this.props.products} 
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}/>
      </div>
    )
  }
}

class NewInventoryItemsForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		  newProduct: []
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		var newItem = {
	  	  category: this.newCategory.value,
	  	  price: this.newPrice.value,
	  	  stocked: true,
	  	  name: this.newName.value,
	    }
		this.setState({
			newProduct: [newItem]
		});
	}

/*newName, newCategory, newPrice, newStocked*/
	render(){
		return(
			<form onSubmit={(e) => {this.props.onSubmit(e,this.state.newProduct)}}>
				{this.props.duplicationCheck ? (<p style={{color: 'red'}}>Item already on file.</p>) : null}
				<label>
					{'Name:'}
					<input 
					  type="text"
					  value={this.state.nameVal}
					  ref={(input) => this.newName = input}
					  onChange={this.handleChange}/>
				</label>
				<br/>
				<label>
				  {'Category: '}
				  <select id="selector"
				    value={this.state.categoryVal} 
				    onChange={this.handleChange} 
				    ref={(input) => this.newCategory = input}>
				    <option value="Other">Other</option>
				  	<option value="Electronics">Electronics</option>
					<option value="Sporting Goods">Sporting Goods</option>
					<option value="Groceries">Groceries</option>
					<option value="Furniture">Furniture</option>
				  </select>
				</label>
				<label>
				  <br/>
					{'Price: $'}
					<input 
					  type="text" 
					  placeholder="10.99"
					  value={this.state.priceVal}
					  onChange={this.handleChange}
					  ref={(input) => this.newPrice = input}/>
				</label>
				<br/>
				
				<br/>
				<button>Add</button>
			</form>
		)
	}
}

class InventoryApp extends React.Component {
	constructor(props){
		super(props);

		this.state = {
          addProduct: [],
          isProductDuplicated: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e, newProduct){
		e.preventDefault();
		var newProduct = newProduct.slice();
		var isProductDuplicated = false;
		var searchProductNames = PRODUCTS.forEach((product) => {
			if(newProduct[0].name === product.name){
				this.setState({isProductDuplicated: true})
				return isProductDuplicated = true
				/*Note: You will not get the updated value of state just after calling 
				it, therefore, var isProductDuplicated will hold the immediate changes. 
				The updated state change is checked and recieved immediately inside 
				the render function */
			}
			return null
		});
		if (!isProductDuplicated){
		  this.setState({
			addProduct: this.state.addProduct.push(newProduct),
		  })
		  if (this.state.addProduct){
 			  const addProduct = this.state.addProduct.slice();
		    this.props.onAddNewProduct(addProduct[0]);
	 	    this.setState({addProduct: []})
		  }
		  this.setState({isProductDuplicated: false})
		  isProductDuplicated = false;
		}		
	}


	render(){
		const duplicationCheck = this.state.isProductDuplicated;//state changes are recieved immediately inside render funciton.
      return(
      	<div>
      		<h3>{'Inventory'}</h3>
      		<NewInventoryItemsForm 
      		  onSubmit={(e, newProduct) => this.handleSubmit(e,newProduct)}
      		  duplicationCheck={duplicationCheck}
      		/>
      		<br/>
      		<FilterableProductTable
      		  products={mergeSort(PRODUCTS)}
      		/>
      	</div>
	  )
	}
}



ReactDOM.render(
  <InventoryApp onAddNewProduct={(z) => quantify(z)} />,
  document.getElementById('root')
)


