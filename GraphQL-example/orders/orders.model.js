const orders = [
  {
    id: "order-1",
    date: "2021-01-01",
    subtotal: 300,
    items: [
      {
        product: {
          id: "red-shoe",
          description: "Old Red Shoe",
          price: 45,
        },
        quantity: 1,
      },
      {
        product: {
          id: "blue-jean",
          description: "Old Blue Jean",
          price: 100,
        },
        quantity: 1,
      },
    ],
  },
];

function getAllOrders() {
  return orders;
}
module.exports = {
  getAllOrders,
};
