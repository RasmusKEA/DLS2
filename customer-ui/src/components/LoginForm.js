import React, { useState } from 'react';
import ItemForm from './ItemForm';
import axios from 'axios';

const LoginForm = () => {
  const [itemForms, setItemForms] = useState([
    {
      itemID: '',
      itemName: '',
      quantity: '',
      price: '',
    },
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const [fieldName, index] = name.split('-');
    setItemForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms[index] = {
        ...updatedForms[index],
        [fieldName]: value,
      };
      return updatedForms;
    });
  };

  const addItem = () => {
    setItemForms((prevForms) => [
      ...prevForms,
      {
        itemID: '',
        itemName: '',
        quantity: '',
        price: '',
      },
    ]);
  };

  const removeItem = (index) => {
    setItemForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms.splice(index, 1);
      return updatedForms;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      returnType: 'link',
      fileName: 'example.pdf',
      content: JSON.stringify(itemForms), // Convert itemForms to a JSON string
    };
  
    try {
      const response = await axios.post('http://localhost:8080/convertPDF', data);
  
      // Handle the response here
      console.log(response.data);
      // Further processing of the response, such as updating the UI or redirecting
    } catch (error) {
      console.error('Error:', error);
      // Handle the error appropriately, such as displaying an error message to the user
    }
  };

  return (
    <div>
      {itemForms.map((form, index) => (
        <ItemForm
          key={index}
          index={index}
          formData={form}
          handleChange={handleChange}
          removeItem={removeItem}
        />
      ))}
      <button onClick={addItem}>+</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default LoginForm;