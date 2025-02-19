const orderModel = require("./orders.model");

module.exports = {
  Query: {
    orders: () => orderModel.getAllOrders(),
  },
};
