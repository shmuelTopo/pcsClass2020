var express = require('express');
const Cart = require('../cart');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get((req, res, next) => {
    console.log(req.session.cart);
    res.render('layout', {
      title: 'Express',
      items: global.items,
      partials: {
        content: 'index'
      }
    });
  })
  .post((req, res, next) => {
    const cart = new Cart(req.session.cart);
    console.log('cart', cart);
    cart.addItem(req.body.id, +req.body.quantity);
    req.session.cart = cart;
    res.redirect('/');
  });

module.exports = router;
