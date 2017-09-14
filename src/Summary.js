import React from 'react';

const Summary = ({ products, categories} )=> {
  const productsWithoutACategory = products.filter( product => !product.categoryId );
  const productsOutOfStock = products.filter( product => !product.inStock );
  const mostExpensiveProduct = products.reduce((memo, product)=> {
    if(product.price >= memo.price)
      memo = product;
    return memo;
  }, { price: 0});
  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        Product Summary
      </div>
      <div className='panel-body'>
        <ul className='list-group'>
          <li className='list-group-item'>
            There are <strong>{ products.length }</strong> products.
          </li>
          <li className='list-group-item'>
            Categories:
            <ul>
              {
                categories.map( category => {
                  return (
                    <li key={ category.id}>
                      { category.name } has <strong>{ category.products.length }</strong> Products
                    </li>
                  )
                })
              }
              <li>
                <strong>{ productsWithoutACategory.length }</strong> product(s) have no category.
              </li>
            </ul>
          </li>
          {
            mostExpensiveProduct.id &&
            <li className='list-group-item'>Most Expensive product is <strong>{ mostExpensiveProduct.name}</strong> at { mostExpensiveProduct.price }</li>
          }
          <li className='list-group-item'>Products not in stock are {
            productsOutOfStock.map(product => <span style={ {paddingRight: '10px'}} key={ product.id }>{ product.name }</span>)
          }</li>
        </ul>
      </div>
    </div>
  );
};

export default Summary;
