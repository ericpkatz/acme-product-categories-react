const express = require('express');
const app = express();
app.use(require('body-parser').json());
const path = require('path');

const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/my_db');

const Product = conn.define('product', {
  name: {
    type: conn.Sequelize.STRING,
    unique: true
  },
  price: {
    type: conn.Sequelize.FLOAT,
    defaultValue: 0
  },
  inStock: {
    type: conn.Sequelize.BOOLEAN,
    defaultValue: true
  }
});

const Category = conn.define('category', {
  name: conn.Sequelize.STRING
});

Product.belongsTo(Category);
Category.hasMany(Product);


conn.sync({ force: true })
  .then(()=> {
    return Promise.all([
      Product.create({ name: 'foo', price: 10 }),
      Product.create({ name: 'foo 2', price: 20 }),
      Product.create({ name: 'bar', inStock: false }),
      Product.create({ name: 'bazz', inStock: false }),
      Category.create({ name: 'Foo Category' }),
      Category.create({ name: 'Bar Category' }),
    ])
    .then(([foo, foo2, bar,  bazz, fooCategory, barCategory])=> {
      return Promise.all([
        fooCategory.addProducts([ foo, foo2 ]),
        barCategory.addProduct(bar)
      ]);
    });
  })

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/products', (req, res, next)=> {
  Product.findAll({
    order: ['id'],
    include: Category
  })
  .then( products => res.send(products))
  .catch(next);
});

app.get('/api/categories', (req, res, next)=> {
  Category.findAll({
    order: ['id'],
    include: Product 
  })
  .then( categories => res.send(categories))
  .catch(next);
});

app.put('/api/products/:id', (req, res, next)=>{
  Product.findById(req.params.id)
    .then( product => {
      if(!req.body.categoryId){
        req.body.categoryId = null;
      }
      Object.assign(product, req.body);
      return product.save();
    })
    .then(()=> res.sendStatus(204))
    .catch(next);
});

app.post('/api/products/', (req, res, next)=>{
  Product.create(req.body)
    .then(()=> res.sendStatus(204))
    .catch(next);
});




app.listen(process.env.PORT || 3000);
