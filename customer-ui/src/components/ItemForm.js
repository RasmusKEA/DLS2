import React from 'react';

const ItemForm = ({ index, formData, handleChange, removeItem }) => {
  return (
    <div>
      <h3>Item {index + 1}</h3>
      <label>
        Item ID:
        <input
          type="text"
          name={`itemID-${index}`}
          value={formData[`itemID-${index}`]}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Item Name:
        <input
          type="text"
          name={`itemName-${index}`}
          value={formData[`itemName-${index}`]}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Quantity:
        <input
          type="number"
          name={`quantity-${index}`}
          value={formData[`quantity-${index}`]}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="number"
          name={`price-${index}`}
          value={formData[`price-${index}`]}
          onChange={handleChange}
        />
      </label>
      <br />
      <button onClick={() => removeItem(index)}>-</button>
    </div>
  );
};

export default ItemForm;