const express = require('express')
const router = express.Router()

const UserRouter = require('./user-route')
const AddressRouter = require('./address-route')
const OrderRouter = require('./order-route')
const OrderItemRouter = require('./order-item-route')
const CartRouter = require('./cart-route')
const CategoryRouter = require('./category-route')
const ProductRouter = require('./product-route')
const ProductOptionRouter = require('./product-option-route')

router.use('/user', UserRouter)
router.use('/address', AddressRouter)
router.use('/order', OrderRouter)
router.use('/order-item', OrderItemRouter)
router.use('/cart', CartRouter)
router.use('/category', CategoryRouter)
router.use('/product', ProductRouter)
router.use('/product-option', ProductOptionRouter)

module.exports = router