import React, { Component } from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'


export default class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            string: '',
            products: [],
            filterType: '', // price vs quantity vs rating
            sortType: 1, // ascending vs descending
            quantity: 0
        }

        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
    }


    onChangeSearch(event) {
        this.setState({ string: event.target.value });
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        const params = {
            string: this.state.string,
            filter: this.state.filterType,
            sort: this.state.sortType
        }

        const options = { params: params, headers: headers };

        axios.get('http://localhost:4000/customer/search', options)
            .then(res => {
                if (res.data.error)
                    alert(res.data.error);
                this.setState({ products: res.data });
            })
            .catch(err => {
                alert(err)
            });

        this.setState({
            string: '',
        });
    }

    placeOrder(id) {
        let token = localStorage.getItem('token');

        const Order = {
            productid: id,
            quantity: this.state.quantity
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        axios.post('http://localhost:4000/order/add', Order, { headers: headers })
            .then(response => {
                alert("Order placed!");
                console.log(response.data)
            })
            .catch(err => console.log(err));

        this.setState({
            quantity: '',
            products: [],

        })

        // window.location.reload();
    }

    render() {
        // const { products} = this.state;
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Product name: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.search}
                            onChange={this.onChangeSearch}
                        />
                    </div>
                    <div>
                        <Button variant="info" onClick={() => this.setState({ filterType: "price" })} >Order by price</Button> &nbsp; &nbsp;
                        <Button variant="info" onClick={() => this.setState({ filterType: "quantity" })} >Order by quantity</Button>&nbsp; &nbsp;
                        <Button variant="info" onClick={() => this.setState({ filterType: "rating" })} >Order by rating</Button>
                        <br></br>
                        <br></br>
                        <Button variant="info" onClick={() => this.setState({ sortType: "ascending" })} >Ascending </Button> &nbsp; &nbsp;
                        <Button variant="info" onClick={() => this.setState({ sortType: "descending" })} >Descending</Button>&nbsp; &nbsp;
                        <br></br>
                        <br></br>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary" />
                    </div>
                </form>


                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity left</th>
                            <th>Vendor</th>
                            <th>Rating</th>
                            <th>Quantity</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((Product, i) => {
                                let left = 0, rating = 0;
                                if (Product.remaining >= 0)
                                    left = Product.remaining;
                                else
                                    left = 0;

                                rating = Product.vendorrating;
                                if (!rating)
                                    rating = 0;

                                return (
                                    <tr key={i}>
                                        <td>{Product.name}</td>
                                        <td>{Product.price} </td>
                                        <td>{left}</td>
                                        <td><Link to={{ pathname: '/vendorReviews', state: { id: Product.vendorid, name: Product.vendorname } }}>{Product.vendorname} </Link></td>
                                        <td>{rating}</td>
                                        {/* <form onSubmit={this.onOrder}> */}
                                        <td><input type="number" min="1" value={this.state.remaining} onChange={this.onChangeQuantity} /> </td>
                                        <td><Button variant="success" onClick={() => { this.placeOrder(Product._id) }}>Buy</Button></td>
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