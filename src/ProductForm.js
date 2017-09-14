import React, { Component } from 'react';

export default class ProductForm extends Component{
  constructor({ product, categories, onSave }){
    super();
    this.state = {
      product: product || {},
      dirty: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    const emptyCategory = {
      text: '-- none --',
      value: ''
    };
    this.categoryOptions = categories.map( category => (
      {
        value: category.id,
        text: category.name

      }
    ));
    this.categoryOptions = [ emptyCategory, ...this.categoryOptions ];
  }
  onChange(ev){
    const change = {};
    change[ev.target.name] = ev.target.type=== 'checkbox' ? ev.target.checked : ev.target.value;
    const product = Object.assign(this.state.product, change);
    this.setState({ product, dirty: true });
  }
  onSave(ev){
    ev.preventDefault();
    this.props.onSave(this.state.product)
      .then(()=> this.setState( { dirty: false, error: null }))
      .catch( ex => this.setState({ error: ex }));
  }
  render(){
    const { product, dirty, error } = this.state;
    const { categoryOptions, onChange, onSave } = this;
    return (
      <form>
        {
          error && <div className='alert alert-danger'>{ error.toString() }</div>
        }

        <div className='form-group'>
          <label>Name</label>
          <input name='name' onChange={ onChange } className='form-control' value={ product.name } />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input type='number' name='price' onChange={ onChange } className='form-control' value={ product.price } />
        </div>
        <div className='form-group'>
          <label>Instock</label>
          <br />
          <input onChange={ onChange } type='checkbox' name='inStock' checked={ product.inStock } />
        </div>
        <div className='form-group'>
          <label>Category</label>
          <select onChange={ this.onChange } name='categoryId' value={ product.categoryId || ''  } className='form-control'>
            {
              categoryOptions.map( option => <option value={ option.value } key={ option.value }>{ option.text }</option>)
              
            }
          </select>
        </div>
        <div className='form-group'>
          <button disabled={ !dirty } className='btn btn-primary' onClick={ onSave }>Save</button>
        </div>
      </form>
    );
  }
}
