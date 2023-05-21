import React, { useState } from "react";
import axios from "axios";
import "../styling/ProductForm.css";

const ProductForm = () => {
  const [products, setProducts] = useState([{ id: "", name: "", price: "" }]);

  const handleChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { id: "", name: "", price: "" }]);
  };

  const deleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleSubmit = () => {
    // Send a POST request to "localhost:8080/create-pdf" with the product data
    // You can use a library like axios to make the HTTP request

    // Example using axios:
    axios
      .post("http://localhost:8080/convertPDF", {
        content: products,
        email: localStorage.getItem("email"),
      })
      .then((response) => {
        console.log(response.data); // Handle the response as needed
      })
      .catch((error) => {
        console.error(error); // Handle any errors that occur during the request
      });
  };

  return (
    <div className="product-form">
      {products.map((product, index) => (
        <div key={index} className="product-row">
          <input
            type="text"
            placeholder="ID"
            value={product.id}
            onChange={(e) => handleChange(index, "id", e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            value={product.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Price"
            value={product.price}
            onChange={(e) => handleChange(index, "price", e.target.value)}
          />
          <button onClick={() => deleteProduct(index)}>Delete</button>
        </div>
      ))}
      <button onClick={addProduct}>Add Product</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ProductForm;
