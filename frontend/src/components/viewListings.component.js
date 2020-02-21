import React, { Component, useState } from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'

export default class Listings extends Component {

    constructor(props) {
        super(props);
        this.deleteProduct = this.deleteProduct.bind(this)
        this.state = { listings: [] }
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        axios.get('http://localhost:4000/vendor/product', { headers })
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


    deleteProduct(id) {
        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        axios.post('http://localhost:4000/vendor/cancel', { 'productid': id }, { headers })
            .then(response => { console.log(response.data) });

        this.setState({
            listings: this.state.listings.filter(el => el._id !== id)
        })
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
                                        <td> <Button variant="danger" onClick={() => { this.deleteProduct(product._id) }}>Delete</Button></td>
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