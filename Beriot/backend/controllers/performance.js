// Implement code splitting and lazy loading
import React, { Suspense, lazy } from 'react';

const ProductList = lazy(() => import('./ProductList'));
const ProductDetail = lazy(() => import('./ProductDetail'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Switch>
          <Route exact path="/" component={ProductList} />
          <Route path="/product/:id" component={ProductDetail} />
        </Switch>
      </Router>
    </Suspense>
  );
}

// Memoization for performance
const MemoizedProductCard = React.memo(ProductCard);