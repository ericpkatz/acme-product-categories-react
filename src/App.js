import React, { Component } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import Summary from './Summary';


class App extends Component{
  constructor(){
    super();
    this.state = { products: [] };
    this.onSave = this.onSave.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
  }
  onSave(product){
    return axios.put(`/api/products/${product.id}`, product)
      .then(()=> this.loadProducts());
  }
  loadProducts(){
    Promise.all([
      axios.get('/api/categories'),
      axios.get('/api/products')
    ])
    .then( results => results.map( result => result.data))
    .then( ([ categories, products]) => this.setState({ categories, products }));
  }
  componentDidMount(){
    this.loadProducts();
  }

  render(){
    const { products, categories } = this.state;
    const { onSave } = this;
    return (
      <div className='container'>
        <h1>Acme Product/Categories React</h1>
        <div className='row'>
          <div className='col-sm-8'>
        {
          products.map( product => {
            return (
              <div className='col-sm-4' key={ product.id }>
                <div className='panel panel-default'>
                  <div className='panel-body'>
                    <ProductForm onSave={ onSave } categories={ categories } product={ product } />
                  </div>
                </div>
              </div>
            );
          })
        }
          </div>
          <div className='col-sm-4'>
            <Summary products={ products }/>
          </div>
        </div>
      </div>
    );
  }
  
}

export default App;
