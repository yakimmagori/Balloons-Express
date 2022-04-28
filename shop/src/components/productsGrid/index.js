import React from "react";
import ProductBox from "./productBox";

const ProductsGrid = ({ products, title }) => {
  return (
    <div className="products-grid">
      <div className="container">
        <h2>{title || "view all products"}</h2>
        {products.length > 0 ? (
          <div className="products-wrapper">
            {products.map((product, index) => (
              <ProductBox key={index} product={product} />
            ))}
          </div>
        ) : 'No products found'}
      </div>
    </div>
  );
};

export default ProductsGrid;
