import React, { Component, useState } from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'

export default class readyListings extends Component {

    constructor(props) {
        super(props);
        this.productDispatch = this.productDispatch.bind(this);
        this.state = { listings: [] }
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        axios.get('http://localhost:4000/vendor/viewPlaced', { headers: headers })
            .then(res => {
                if (res.data.error)
                    alert(res.data.error);
                else {
                    this.setState({ listings: res.data });
                }
            })
            .catch(function (error) {
                alert(error);
            })
    }

    productDispatch = this.productDispatch;

    productDispatch(id) {
        let token = localStorage.getItem('token');

        const Product = {
            productid: id,
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        axios.post('http://localhost:4000/vendor/dispatch', Product, { headers: headers })
            .then(response => { console.log(response.data) })


        window.location.reload();
    }

    deleteProduct = this.deleteProduct;

    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity left</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.listings.map((product, i) => {
                                let left = 0;
                                if (product.remaining > 0) left = product.remaining
                                else left = 0;
                                return (
                                    <tr key={i} deleteProduct={this.deleteProduct}>
                                        <td>{product.name}</td>
                                        <td>{left} </td>
                                        <td><Button variant="warning" onClick={() => { this.productDispatch(product._id) }}>Dispatch</Button></td>

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