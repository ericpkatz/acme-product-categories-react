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
    axios.put(`/api/products/${product.id}`, product)
      .then(()=> this.loadProducts());
  }
  loadProducts(){
    axios.get('/api/products')
    .then(( result ) => result.data)  
    .then( products => this.setState({ products }));
  }
  componentDidMount(){
    this.loadProducts();
  }

  render(){
    const { products } = this.state;
    const { onSave } = this;
    const categories = products.reduce((memo, product)=> {
      const found = memo.find( category => category.id === product.categoryId);
      if(!found && product.category){
        memo.push(product.category);
      }
      return memo;
    }, []);
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
                    { product.name }
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
