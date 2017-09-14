import React from 'react';

const Summary = ({ products} )=> {
  const categoryMap = products.reduce((memo, product) => {
    if(product.category){
      memo[product.category.name] = memo[product.category.name] || [];
      memo[product.category.name].push(product);
    }
    return memo;
  }, {});
  const productsWithoutACategory = products.filter( product => !product.categoryId );
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
                Object.keys(categoryMap).map( key => {
                  return (
                    <li key={ key}>
                      { key } has <strong>{ categoryMap[key].length }</strong> Products
                    </li>
                  )
                })
              }
              <li>
                <strong>{ productsWithoutACategory.length }</strong> product(s) have no category.
              </li>
            </ul>
          </li>
          <li className='list-group-item'>Most Expensive</li>
          <li className='list-group-item'>Products not in stock</li>
        </ul>
      </div>
    </div>
  );
};

export default Summary;
