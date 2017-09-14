import React, { Component } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Summary from './Summary';


class App extends Component{
  constructor(){
    super();
    this.state = { products: [], categories: [], categoryOptions: [] };
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
  }
  onDelete(product){
    return axios.delete(`/api/products/${product.id}`)
      .then(()=> this.loadProducts());
  }
  onSave(product){
    if(product.id){
      return axios.put(`/api/products/${product.id}`, product)
        .then(()=> this.loadProducts());
    }
    else {
      return axios.post('/api/products/', product)
        .then(()=> this.loadProducts());
    }
  }
  loadProducts(){
    Promise.all([
      axios.get('/api/categories'),
      axios.get('/api/products')
    ])
    .then( results => results.map( result => result.data))
    .then(([categories, products])=> {
      const emptyCategory = {
        text: '-- none --',
        value: ''
      };
      let categoryOptions = categories.map( category => (
        {
          value: category.id,
          text: category.name

        }
      ));
      categoryOptions = [ emptyCategory, ...categoryOptions ];
      this.setState({ products, categories, categoryOptions  })
    });
  }
  componentDidMount(){
    this.loadProducts();
  }
  render(){
    const { products, categories, categoryOptions } = this.state;
    const { onSave, onDelete } = this;
    return (
      <div className='container'>
        <h1>Acme Product/Categories React</h1>
        
        <div className='row'>
          <div className='col-sm-6'>
            <ProductList onSave={ onSave } categoryOptions={ categoryOptions } products={ products } onDelete={ onDelete }/>
          </div>
          <div className='col-sm-3'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                Add a Product
              </div>
              <div className='panel-body'>
                <ProductForm onSave={ onSave } categoryOptions={ categoryOptions } />
              </div>
            </div>
          </div>
          <div className='col-sm-3'>
            <Summary products={ products } categories = { categories }/>
          </div>
        </div>
      </div>
    );
  }
  
}

export default App;
