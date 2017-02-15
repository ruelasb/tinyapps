import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class ProductCategoryRow extends React.Component {
  render(){
    return (
      <tr>
        <th colSpan="3">{this.props.category}</th>
      </tr>
    )
  }
}

class ProductRow extends React.Component {
  render(){
    var style = this.props.product.stocked ? 'none' : 'danger';
    return(
      <tr className={style}>
        <td></td>
        <td>{this.props.product.name}</td>
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
      <table className="table table-striped">
        <thead>
          <tr>
            <td>Category</td>
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
      /*this.inStockOnlyInput.checked*/
    );
  }

render(){
  return(
    <form className="navbar-form navbar-right">
      <input 
      type="text" 
      className="form-control"
      placeholder="Search..." 
      value={this.props.fliterText}
      ref={(input) => this.filterTextInput = input}
      onChange={this.handleChange}/>
      {/*<p className="checkbox-paragraph">
        <input 
          type="checkbox" 
          checked={this.props.inStockOnly}
          ref={(input) => this.inStockOnlyInput = input}
          onChange={this.handleChange}/>
          {' '}
          Only show products in stock
      </p>*/}
    </form>
  )
}
}

class FilterableProductTable extends React.Component {

  render(){
    return(
      <div>
        <ProductTable 
          products={this.props.products} 
          filterText={this.props.filterText}
          inStockOnly={this.props.inStockOnly}/>
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
				{this.props.duplicationCheck ? (<p style={{color: 'red'}}>Items can not be duplicated or without name value.</p>) : null}
				<div className="form-group">  
          <label>{'Name:'}</label>
					<input 
            className="form-control"
					  type="text"
					  value={this.state.nameVal}
					  ref={(input) => this.newName = input}
					  onChange={this.handleChange}/>
				</div>

				<label>{'Category: '}</label>
				  <select
            className="form-control" 
            id="selector"
				    value={this.state.categoryVal} 
				    onChange={this.handleChange} 
				    ref={(input) => this.newCategory = input}>
				    <option value="Other">Other</option>
				  	<option value="Electronics">Electronics</option>
					<option value="Sporting Goods">Sporting Goods</option>
					<option value="Groceries">Groceries</option>
					<option value="Furniture">Furniture</option>
				  </select>
				<br/>
				<label>{'Price:'}</label>
        <div className="input-group">
        <div className="input-group-addon">$</div>
					<input 
            className="form-control"
					  type="text" 
					  placeholder="Amount"
					  value={this.state.priceVal}
					  onChange={this.handleChange}
					  ref={(input) => this.newPrice = input}/>
				</div>
				<br/>
				<button className="btn btn-primary">Add Product</button>
			</form>
		)
	}
}

class InventoryApp extends React.Component {
	constructor(props){
		super(props);

		this.state = {
      filterText: '',
      inStockOnly: false,
      PRODUCTS: [  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
                   {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
                   {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
                   {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
                   {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
                   {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'},],
      isProductDuplicated: false,
    };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
	}

	handleSubmit(e, newProduct){
		e.preventDefault();
		var newProduct = newProduct.slice();
		var isProductDuplicated = false;
    var PRODUCTS = this.state.PRODUCTS;
    //loop to search if the newProduct that is being added already exists.
		var searchProductNames = PRODUCTS.forEach((product) => {
			if(newProduct[0].name === product.name || newProduct[0].name == 0){
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
			PRODUCTS: this.state.PRODUCTS.concat(newProduct),
		  })
		  /*if (this.state.addProduct){
 			  const addProduct = this.state.addProduct.slice();
		    this.props.onAddNewProduct(addProduct[0]);
	 	    this.setState({addProduct: []})
		  }*/
		  this.setState({isProductDuplicated: false})
		  isProductDuplicated = false;
		}		
	}

  handleUserInput(filterText, inStockOnly){
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    })
  }


	render(){
		const duplicationCheck = this.state.isProductDuplicated;//state changes are recieved immediately inside render funciton.
      return(
      	<div>
            <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">{'Inventory App'}</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <SearchBar 
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}/>
        </div>
      </div>
    </nav>

    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-3 col-md-2 sidebar">
            <NewInventoryItemsForm 
              onSubmit={(e, newProduct) => this.handleSubmit(e,newProduct)}
              duplicationCheck={duplicationCheck}
            />
        </div>
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <h1 className="sub-header">Inventory List</h1>
          <div className="table-responsive">
            <FilterableProductTable
              filterText={this.state.filterText}
              inStockOnly={this.state.inStockOnly}
              products={mergeSort(this.state.PRODUCTS)}
            />
          </div>
        </div>
      </div>
    </div>
      	</div>
	  )
	}
}

ReactDOM.render(
  <InventoryApp/>,
  document.getElementById('root')
);

/*---------------------------*/

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
    

   mSort(tmp_l, arr.slice(0,m), m);
   mSort(tmp_r, arr.slice(m), l-m);

    
  return merge(tmp_l, tmp_r, arr);
}


function mergeSort(arr){
  return mSort(arr, arr.slice(), arr.length);
}


