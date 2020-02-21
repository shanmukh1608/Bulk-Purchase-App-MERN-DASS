import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/users-list.component'
import Register from './components/registration.component'
import Login from './components/login.component'
import Customer from './components/customer.component'
import Search from './components/searchProducts.component'
import vendorReviews from './components/vendorReviews.component'
import viewOrders from './components/viewOrders.component'

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
        <Route path="/dashboard" exact component={UsersList}/>
        <Route path="/users" exact component={UsersList}/>
        <Route path="/register" exact component={Register}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/customer" exact component={Customer}/>
        <Route path="/searchProducts" exact component={Search}/>
        {/* <Route path="/vendorReviews" exact component={vendorReviews}/> */}
        <Route path="/viewOrders" exact component={viewOrders}/>



      </div>
    </Router>
  );
}

export default App;
