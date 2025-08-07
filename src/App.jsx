// src/App.jsx
import React, { useReducer, createContext, useContext } from 'react';
import { ShoppingCart, Leaf, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import './App.css';

// Redux-like state management
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'INCREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    
    case 'DECREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    default:
      return state;
  }
};

// Plant data
const plants = [
  // Indoor Plants
  { id: 1, name: "Monstera Deliciosa", price: 45.99, category: "Indoor Plants", thumbnail: "🌿" },
  { id: 2, name: "Snake Plant", price: 32.50, category: "Indoor Plants", thumbnail: "🐍" },
  
  // Succulents
  { id: 3, name: "Jade Plant", price: 18.75, category: "Succulents", thumbnail: "💎" },
  { id: 4, name: "Aloe Vera", price: 22.00, category: "Succulents", thumbnail: "🌵" },
  
  // Flowering Plants
  { id: 5, name: "Peace Lily", price: 38.25, category: "Flowering Plants", thumbnail: "🕊️" },
  { id: 6, name: "African Violet", price: 28.99, category: "Flowering Plants", thumbnail: "💜" }
];

// Header Component
const Header = ({ currentPage, onNavigate, cartItemCount }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Leaf size={32} />
          <h1>GreenThumb Gardens</h1>
        </div>
        
        <nav className="nav">
          <button
            onClick={() => onNavigate('home')}
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
          >
            Shop
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className="cart-button"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

// Landing Page Component
const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="hero-card">
          <h1 className="hero-title">GreenThumb Gardens</h1>
          
          <p className="hero-description">
            Welcome to GreenThumb Gardens, your premier destination for beautiful houseplants 
            that bring life and tranquility to your home. We specialize in carefully curated 
            indoor plants, from easy-care succulents to exotic flowering varieties. Each plant 
            is hand-selected for quality and health, ensuring you receive the perfect green 
            companion for your space. Whether you're a seasoned plant parent or just starting 
            your botanical journey, we have the perfect plants to transform your living space 
            into a lush, green oasis.
          </p>
          
          <button
            onClick={() => onNavigate('products')}
            className="get-started-btn"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Listing Page Component
const ProductListingPage = () => {
  const { state, dispatch } = useContext(CartContext);
  
  const isInCart = (plantId) => {
    return state.items.some(item => item.id === plantId);
  };
  
  const addToCart = (plant) => {
    dispatch({ type: 'ADD_TO_CART', payload: plant });
  };
  
  const categories = [...new Set(plants.map(plant => plant.category))];
  
  return (
    <div className="products-page">
      <div className="container">
        <h2 className="page-title">Our Plant Collection</h2>
        
        {categories.map(category => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            
            <div className="products-grid">
              {plants
                .filter(plant => plant.category === category)
                .map(plant => (
                  <div key={plant.id} className="product-card">
                    <div className="product-thumbnail">{plant.thumbnail}</div>
                    <h4 className="product-name">{plant.name}</h4>
                    <p className="product-price">${plant.price}</p>
                    <button
                      onClick={() => addToCart(plant)}
                      disabled={isInCart(plant.id)}
                      className={`add-to-cart-btn ${isInCart(plant.id) ? 'disabled' : ''}`}
                    >
                      {isInCart(plant.id) ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Shopping Cart Page Component
const ShoppingCartPage = ({ onNavigate }) => {
  const { state, dispatch } = useContext(CartContext);
  
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const increaseQuantity = (id) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: id });
  };
  
  const decreaseQuantity = (id) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: id });
  };
  
  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };
  
  if (state.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingCart size={96} />
            <h2>Your cart is empty</h2>
            <p>Add some beautiful plants to get started!</p>
            <button
              onClick={() => onNavigate('products')}
              className="continue-shopping-btn"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <div className="container">
        <h2 className="page-title">Shopping Cart</h2>
        
        <div className="cart-content">
          <div className="cart-summary">
            <div className="summary-item">
              <span>Total Items: </span>
              <span className="highlight">{totalItems}</span>
            </div>
            <div className="summary-item">
              <span>Total Cost: </span>
              <span className="highlight">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="cart-items">
            {state.items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <div className="item-thumbnail">{item.thumbnail}</div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">${item.price}</p>
                  </div>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="quantity-btn decrease"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="quantity-btn increase"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="delete-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-actions">
            <button
              onClick={() => onNavigate('products')}
              className="continue-shopping-btn"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
            
            <button
              onClick={() => alert('Coming Soon - Checkout functionality will be available soon!')}
              className="checkout-btn"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [] });
  
  const totalCartItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'products':
        return <ProductListingPage />;
      case 'cart':
        return <ShoppingCartPage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };
  
  return (
    <CartContext.Provider value={{ state: cartState, dispatch: cartDispatch }}>
      <div className="app">
        <Header 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          cartItemCount={totalCartItems}
        />
        {renderPage()}
      </div>
    </CartContext.Provider>
  );
};

export default App;