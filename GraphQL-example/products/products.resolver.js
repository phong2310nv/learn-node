const productModel = require("./products.model");

module.exports = {
  Query: {
    products: () => productModel.getAllProducts(),
    productByPrice: (_, args) => {
      console.log(args);

      return productModel.getProductByPrice(args.minPrice, args.maxPrice);
    },
    product: (_, args) => {
      console.log(args);
      return productModel.getProductById(args.id);
    },
  },
  Mutation: {
    addProduct: (_, args) => {
      console.log(args);
      return productModel.addProduct(args.id, args.description, args.price);
    },
    addReview: (_, args) => {
      console.log(args);
      return productModel.addProductReview(args.productId, args.rating, args.comment);
    },
    // updateProduct: (_, args) => {
    //   console.log(args);
    //   return productModel.updateProduct(args.id, args.product);
    // },
    // deleteProduct: (_, args) => {
    //   console.log(args);
    //   return productModel.deleteProduct(args.id);
    // },
  },
};
