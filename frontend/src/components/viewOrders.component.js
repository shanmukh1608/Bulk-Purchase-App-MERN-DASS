import React, { Component, useState } from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default class viewOrders extends Component {

    constructor(props) {
        super(props);
        this.state = { orders: [] };
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        axios.get('http://localhost:4000/customer/orders', { headers })
            .then(res => {
                if (res.data.error)
                    alert(res.data.error)
                else
                    this.setState({ orders: res.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                <h2>Your orders:</h2>
                <br></br>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Vendor</th>
                            <th>Edit</th>
                            <th>Rate<br></br>Vendor</th>
                            <th>Review <br></br>and rate<br></br> product</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.orders.map((Order, i) => {
                                if (Order.status == "Waiting")
                                    return (
                                        <tr key={i}>
                                            <td>{Order.name}</td>
                                            <td>{Order.quantity} </td>
                                            <td>{Order.status} </td>
                                            <td>{Order.vendorname} </td>
                                            <td ><Link to={{ pathname: '/editOrder', state: { 'id': Order._id } }}>Edit</Link></td>
                                            <td></td>
                                            <td></td>

                                        </tr>
                                    )
                                else if (Order.status == "Placed")
                                    return (
                                        <tr key={i}>
                                            <td>{Order.name}</td>
                                            <td>{Order.quantity} </td>
                                            <td>{Order.status} </td>
                                            <td>{Order.vendorname} </td>
                                            <td></td>
                                            <td ><Link to={{ pathname: '/rateVendor', state: { 'vendorname': Order.vendorname } }}> Rate </Link></td>
                                        </tr>
                                    )
                                else if (Order.status == "Dispatched")
                                    return (
                                        <tr key={i}>
                                            <td>{Order.name}</td>
                                            <td>{Order.quantity} </td>
                                            <td>{Order.status} </td>
                                            <td>{Order.vendorname} </td>
                                            <td></td>
                                            <td ><Link to={{ pathname: '/rateVendor', state: { 'vendorname': Order.vendorname } }}>Rate</Link></td>
                                            <td ><Link to={{ pathname: '/reviewOrder', state: { 'id': Order._id } }}>Review</Link></td>
                                        </tr>
                                    )

                                else
                                    return (
                                        <tr key={i}>
                                            <td>{Order.name}</td>
                                            <td>{Order.quantity} </td>
                                            <td>{Order.status} </td>
                                            <td>{Order.vendorname} </td>
                                            <td></td>
                                        </tr>
                                    )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}