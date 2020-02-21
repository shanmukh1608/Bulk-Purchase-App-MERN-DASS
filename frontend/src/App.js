import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import Register from './components/registration.component'
import Login from './components/login.component'
import Customer from './components/customer.component'
import Search from './components/searchProducts.component'
import vendorReviews from './components/vendorReviews.component'
import viewOrders from './components/viewOrders.component'
import editOrder from './components/editOrder.component'
import rateVendor from './components/rateVendor.component'
import reviewOrder from './components/reviewOrder.component'
import Vendor from './components/vendor.component'
import listProduct from './components/listProduct.component'
import viewListings from './components/viewListings.component'
import readyListings from './components/readyToDispatch.component'

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">App</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">Users</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li> 
              <li className="navbar-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li> 
            </ul>
          </div>
        </nav>

        <br/>
        <Route path="/register" exact component={Register}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/customer" exact component={Customer}/>
        <Route path="/searchProducts" exact component={Search}/>
        <Route path="/vendorReviews" exact component={vendorReviews}/>
        <Route path="/viewOrders" exact component={viewOrders}/>
        <Route path="/editOrder" exact component={editOrder}/>
        <Route path="/rateVendor" exact component={rateVendor}/>
        <Route path="/reviewOrder" exact component={reviewOrder}/>
        <Route path="/vendor" exact component={Vendor}/>
        <Route path="/listProduct" exact component={listProduct}/>
        <Route path="/viewListings" exact component={viewListings}/>
        <Route path="/readyListings" exact component={readyListings}/>



      </div>
    </Router>
  );
}

export default App;
