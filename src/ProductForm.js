import React, { Component } from 'react';

export default class ProductForm extends Component{
  constructor({ product, onSave }){
    super();
    this.state = {
      product: product || { price: 0, name: '', inStock: true, random: '0'  },
      dirty: !product ? true : false
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  onChange(ev){
    const change = {};
    change[ev.target.name] = ev.target.type=== 'checkbox' ? ev.target.checked : ev.target.value;
    const product = Object.assign(this.state.product, change);
    this.setState({ product, dirty: true });
  }
  onDelete(ev){
    ev.preventDefault();
    this.props.onDelete(this.state.product);
  }
  onSave(ev){
    ev.preventDefault();
    this.props.onSave(this.state.product)
      .then(()=> {
        const state = { dirty: false, error: null };
        if(!this.state.product.id){
          state.product = {
            name: '',
            inStock: true,
            price: 0,
            random: '0'
          };
          state.dirty = true;

        }
        this.setState( state )
      })
      .catch( ex => {
        let error = ex;
        try{
          error = ex.response.data.errors[0].message;
        }
        catch(ex){
        }
        this.setState({ error });
      });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.product){
      this.setState({ product: nextProps.product });
    }
  }
  render(){
    const { categoryOptions } = this.props;
    const { product, dirty, error } = this.state;
    const { onChange, onSave, onDelete } = this;
    return (
      <form>
        {
          error && <div className='alert alert-danger'>{ error.toString() }</div>
        }
        <div className='form-group'>
          <label>Name ({ product.random })</label>
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
          <button disabled={ !dirty } className='btn btn-primary btn-block' onClick={ onSave }>Save</button>
        { 
          product.id && 
          <button className='btn btn-danger btn-block' onClick={ onDelete }>Delete</button>
        }
        </div>
      </form>
    );
  }
}
