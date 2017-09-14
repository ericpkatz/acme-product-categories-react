import React from 'react';
import ProductForm from './ProductForm';

const ProductList = ({ products, onSave, categoryOptions, onDelete })=> {
  return (
    <div>
        {
          products.map( product => {
            return (
              <div className='col-sm-4' key={ product.id }>
                <div className='panel panel-default'>
                  <div className='panel-body'>
                    <ProductForm onSave={ onSave } categoryOptions={ categoryOptions } product={ product } onDelete={ onDelete }/>
                  </div>
                </div>
              </div>
            );
          })
        }
    </div>
  );
}
export default ProductList;
