// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <div className="App">
        <Navbar cartItemCount={cart.length} />
        <Switch>
          <Route exact path="/" component={ProductList} />
          <Route 
            path="/product/:id" 
            render={(props) => (
              <ProductDetail 
                {...props} 
                addToCart={addToCart} 
              />
            )}
          />
          <Route 
            path="/cart" 
            render={() => (
              <Cart 
                cart={cart} 
                removeFromCart={removeFromCart} 
              />
            )}
          />
          <Route path="/checkout" component={Checkout} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// ProductList.js
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="product-list">
      {loading ? (
        <div>Loading...</div>
      ) : (
        products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))
      )}
    </div>
  );
}

export default ProductList;

// ProductDetail.js
import React, { useState, useEffect } from 'react';

function ProductDetail({ match, addToCart }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [match.params.id]);

  const fetchProductDetails = async () => {
    const response = await fetch(`/api/products/${match.params.id}`);
    const data = await response.json();
    setProduct(data);
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity
    });
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      
      <div className="quantity-selector">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetail;

