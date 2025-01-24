// store.js
import { createStore, combineReducers } from 'redux';
import cartReducer from './reducers/cartReducer';
import productReducer from './reducers/productReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productReducer
});

const store = createStore(rootReducer);

export default store;



