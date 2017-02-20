import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class ProductCategoryRow extends React.Component {
  render(){
    return (
      <tr>
        <th colSpan="4">{this.props.category}</th>
      </tr>
    )
  }
}

class ProductRow extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      itemChecked: false
    }

    this.itemChecked = this.itemChecked.bind(this);
  }
  itemChecked(item){
    this.props.itemClicked(item);
    this.setState({
       itemChecked: item.checked
    });
  }
  render(){

    var style = this.props.product.stocked ? 'none' : 'danger';
    return(
      <tr className={style}>
        <td>
          <input type="checkbox" 
                 onChange={(item) => {this.itemChecked(item.target)}}/>
        </td>
        <td>{this.props.product.name}</td>
        <td>{this.props.product.price}</td>
        <td>
          {this.props.product.stocked ? 'in-stock' : 'out-of-stock'}
          {/* this.state.itemChecked
            ? 
              <a href="#" style={{float: 'right'}} onClick={() => this.props.itemDelete(this.props.product.name)}>
                <i style={{color: 'gray'}} className="fa fa-trash-o fa-lg" aria-hidden="true"></i>
              </a> 
            : null
          */}
        </td>
      </tr>
    )
  }
}

class ProductTable extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      toBeDeleted: []
    }

    this.itemsChecked = this.itemsChecked.bind(this);
    this.onBulkBtn = this.onBulkBtn.bind(this);
  }

  itemsChecked(checkbox, product){
    var toBeDeleted = this.state.toBeDeleted.slice();
    if(checkbox.checked === true && toBeDeleted.indexOf(product.name) === -1){
       this.setState({toBeDeleted: this.state.toBeDeleted.concat(product.name)})
    }else if (checkbox.checked === false){
       toBeDeleted.splice(toBeDeleted.indexOf(product.name), 1);
       this.setState({toBeDeleted: toBeDeleted})
    };
  }

  onBulkBtn(e){
    this.state.toBeDeleted.length ? this.props.bulkDelete(this.state.toBeDeleted) : console.log('Button Clicked');
    this.setState({toBeDeleted: []});
  }

  render(){
    var rows = [];
    var lastCategory = null;
    this.props.products.length ? this.props.products.forEach((product) => {
      if(product.name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1 || (!product.stocked && this.props.inStockOnly)){
        return;
      }
      if(product.category !== lastCategory){
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} 
                            key={product.name} 
                            itemDelete={this.props.itemDelete} 
                            itemClicked={(item) => {this.itemsChecked(item, product)}}/>);
      lastCategory = product.category;
    }) : rows.push(<tr><th colSpan="4">{'Inventory list is empty or can not be found. Please make a new list!'}</th></tr>)
    return(
      <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <td>Category</td>
            <td>Name</td>
            <td>Price</td>
            <td>
              Stocked
              {this.state.toBeDeleted.length >= 1 
                ? 
                  <a href="#" style={{float: 'right', textDecoration: 'none'}} id="BulkBtn" onClick={this.onBulkBtn}>
                    <i className="fa fa-trash-o fa-lg" aria-hidden="true"></i>
                  </a> 
                : null
              }
            </td>
          </tr>
        </thead>
        <tbody>
        {rows}
        </tbody>
      </table>
      </div>
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
    <form className="navbar-form navbar-right">
      <input 
      type="text" 
      className="form-control"
      placeholder="Search..." 
      value={this.props.fliterText}
      ref={(input) => this.filterTextInput = input}
      onChange={this.handleChange}/>
      <p className="checkbox-paragraph">
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

  render(){
    return(
      <div>
        <ProductTable 
          products={this.props.products} 
          filterText={this.props.filterText}
          inStockOnly={this.props.inStockOnly}
          itemDelete={this.props.itemDelete}
          bulkDelete={this.props.bulkDelete}/>
      </div>
    )
  }
}

class NewInventoryItemsForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		  newProduct: [{category: null, price: null, stocked: null, name: false}]
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		var newItem = {
	  	  category: this.newCategory.value,
	  	  price: this.newPrice.value.indexOf('$') === -1 ? '$' + this.newPrice.value : this.newPrice.value,
	  	  stocked: this.newStocked.value === "true" ? true : false,
	  	  name: this.newName.value,
	    }
		this.setState({
			newProduct: [newItem]
		});
	}

/*newName, newCategory, newPrice, newStocked*/
	render(){
		return(
      <div>
      <h3 style={{marginTop: "0px"}}>New Product</h3>
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
        <label>{'Stocked: '}</label>
        <select
          className="form-control"
          value={this.state.stocked}
          onChange={this.handleChange}
          ref={(input) => this.newStocked = input}>
          <option value='true'>in-stock</option>
          <option value='false'>out-of-stock</option>
        </select>
				<br/>
				<button className="btn btn-primary">Add Product</button>
			</form>
      </div>
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
      toBeRemoved: [],
    };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleItemDelete = this.handleItemDelete.bind(this);
        this.onBulkDelete = this.onBulkDelete.bind(this);
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
				The updated state change is checked and recieved immesdiately inside 
				the render function */
			}
			return null
		});
		if (!isProductDuplicated){
		  this.setState({PRODUCTS: this.state.PRODUCTS.concat(newProduct), isProductDuplicated: false});
		  isProductDuplicated = false;
		}		
	}

  handleSearchInput(filterText, inStockOnly){
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    })
  }

  handleItemDelete(itemToDelete){
    var newProductList = [];
    this.state.PRODUCTS.forEach((product) => {
      if(product.name !== itemToDelete){
        newProductList.push(product);
      }
    })
    this.setState({
      PRODUCTS: newProductList
    });
  }

  onBulkDelete(bulk){
    console.log('onBulkDelete function');
    var trueBulk = [];
    this.state.PRODUCTS.forEach((product) => {
        if(bulk.indexOf(product.name) !== -1){ return }
        trueBulk.push(product)
    })
    this.setState({PRODUCTS: trueBulk})
  }

	render(){
		const duplicationCheck = this.state.isProductDuplicated;//state changes are recieved immediately inside render funciton.
      return(
      	<div>
            <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">{'Inventory App | Bryant Ruelas Design'}</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <SearchBar 
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleSearchInput}/>
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
            <hr style={{borderTop: '1px solid #ccc'}}/>
        </div>
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <h1 className="sub-header">Inventory List</h1>
          <div className="table-responsive">
            <FilterableProductTable
              filterText={this.state.filterText}
              inStockOnly={this.state.inStockOnly}
              products={mergeSort(this.state.PRODUCTS)}
              itemDelete={(item) => {this.handleItemDelete(item)}}
              bulkDelete={(bulk) => {this.onBulkDelete(bulk)}}
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
    
  if(l<=1) return arr;
    
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


