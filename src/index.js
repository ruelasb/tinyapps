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
  }
  render(){
    return(
      <div>
        <SearchBar 
          filterText={this.props.filterText}
          inStockOnly={this.props.inStockOnly}
          onUserInput={this.props.onUserInput}/>
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
		/*this.state = {
		  category: ,
	  	  price: ,
	  	  stocked: ,
	  	  name: ,
		};*/
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		//const stockedToggle = this.newStocked.checked === false ? false : true;
		this.props.onFormChange(
			this.newName.value,
			this.newCategory.value,
			this.newPrice.value,
			//stockedToggle
		)
	}


/*newName, newCategory, newPrice, newStocked*/
	render(){
		return(
			<form onSubmit={this.props.onSubmit}>
				<label>
					{'Name:'}
					<input 
					  type="text"
					  value={this.props.nameVal}
					  ref={(input) => this.newName = input}
					  onChange={this.handleChange}/>
				</label>
				<br/>
				<label>
				  {'Category: '}
				  <select id="selector"
				    value={this.props.categoryVal} 
				    onChange={this.handleChange} 
				    ref={(input) => this.newCategory = input}>
				    <option value="other">Other</option>
				  	<option value="electronics">Electronics</option>
					<option value="Sporting Goods">Sporting Goods</option>
					<option value="groceries">Groceries</option>
					<option value="furniture">Furniture</option>
				  </select>
				</label>
				<label>
				  <br/>
					{'Price: $'}
					<input 
					  type="text" 
					  placeholder="10.99"
					  value={this.props.priceVal}
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
          filterText: '',
          inStockOnly: false,
          addProduct: [],
          newProduct: {category: 'other', price: '', stocked: true, name: ''}
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sortCategory = this.sortCategory.bind(this);
	}

	handleFormChange(newName, newCategory, newPrice, newStocked){
	  var newItem = {
	  	category: newCategory,
	  	price: newPrice,
	  	stocked: true,
	  	name: newName,
	  }
	  this.setState({
	  	newProduct: newItem
	  })
	  
	}

	handleSubmit(e){
		e.preventDefault();
		this.setState({
			addProduct: this.state.addProduct.push(this.state.newProduct),
			newProduct: {}
		})
		if (this.state.addProduct){
				const addProduct = this.state.addProduct.slice();
		  	    this.props.onAddNewProduct(addProduct[0]);
		  	    this.setState({addProduct: []})
		  	}
	}


	handleUserInput(filterText, inStockOnly){
      this.setState({
        filterText: filterText,
        inStockOnly: inStockOnly
      })
    }

     //add category sort on PRODUCTS array
      sortCategory(a,b){
        var catA = a.category.toLowerCase();
        var catB = b.category.toLowerCase();
        if(catA < catB){
        	console.log("sorting first");
          return 1
        }
        console.log("sorting second");
        if (catA > catB){
          return -1
        }
        console.log("******");
          return 0
      } 

	render(){
      return(
      	<div>
      		<h3>{'Inventory'}</h3>
      		<NewInventoryItemsForm 
      		  onSubmit={this.handleSubmit}
      		  onFormChange={this.handleFormChange}
      		  categoryVal={this.state.newProduct.category}
      		  priceVal={this.state.newProduct.price}
      		  stockedVal={this.state.newProduct.stocked}
      		  nameVal={this.state.newProduct.name}
      		/>
      		<br/>
      		<FilterableProductTable
      		  filterText={this.state.filterText}
      		  inStockOnly={this.state.inStockOnly}
      		  onUserInput={this.handleUserInput}
      		  products={PRODUCTS.sort(this.sortCategory)}
      		/>
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
  <InventoryApp onAddNewProduct={(z) => quantify(z)} />,
  document.getElementById('root')
)


