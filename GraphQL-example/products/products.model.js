const products = [
  {
    id: "red-shoe",
    description: "Red Shoe",
    price: 100,
    reviews: [],
  },
  {
    id: "b;ue-jean",
    description: "Blue Jean",
    price: 200,
    reviews: [],
  },
];
function getAllProducts(params) {
  return products;
}
function getProductByPrice(min, max) {
  return products.filter(
    (product) => product.price >= min && product.price <= max
  );
}
function getProductById(id) {
  return products.find((product) => product.id === id);
}
function addProduct(id, description, price) {
  const newProduct = {
    id,
    description,
    price,
    reviews: [],
  };
  products.push(newProduct);
  return newProduct;
}
function addProductReview(id, rating, comment) {
  const product = getProductById(id);
  if (product) {
    const newReview = {
      rating,
      comment,
    };
    product.reviews.push(newReview);
    return newReview;
  }
}
module.exports = {
  getAllProducts,
  getProductByPrice,
  getProductById,
  addProduct,
  addProductReview,
};
