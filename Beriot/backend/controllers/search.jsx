// SearchComponent.js
import React, { useState } from 'react';

function SearchComponent({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    inStock: false
  });

  const handleSearch = () => {
    onSearch({
      searchTerm,
      filters
    });
  };

  return (
    <div className="search-container">
      <input 
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select 
        value={filters.category}
        onChange={(e) => setFilters({
          ...filters,
          category: e.target.value
        })}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="home">Home</option>
      </select>

      <div className="price-range">
        <input 
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) => setFilters({
            ...filters,
            priceRange: [0, e.target.value]
          })}
        />
        <span>Price: ${filters.priceRange[1]}</span>
      </div>

      <label>
        <input 
          type="checkbox"
          checked={filters.inStock}
          onChange={(e) => setFilters({
            ...filters,
            inStock: e.target.checked
          })}
        />
        In Stock Only
      </label>

      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

// Backend Search Implementation
app.get('/api/products/search', async (req, res) => {
  const { 
    searchTerm, 
    category, 
    minPrice, 
    maxPrice, 
    inStock 
  } = req.query;

  try {
    const searchCriteria = {};

    if (searchTerm) {
      searchCriteria.name = { 
        $regex: searchTerm, 
        $options: 'i' 
      };
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (minPrice && maxPrice) {
      searchCriteria.price = {
        $gte: minPrice,
        $lte: maxPrice
      };
    }

    if (inStock) {
      searchCriteria.stockQuantity = { $gt: 0 };
    }

    const products = await Product.find(searchCriteria);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});