import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class listProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            price: '',
            remaining: 0
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeRemaining = this.onChangeRemaining.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeName(event) {
        this.setState({ name: event.target.value });
    }

    onChangePrice(event) {
        this.setState({ price: event.target.value });
    }

    onChangeRemaining(event) {
        this.setState({ remaining: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            price: Number(this.state.price),
            remaining: Number(this.state.remaining)
        }

        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        axios.post('http://localhost:4000/product/add', newUser, {headers})
            .then(res => {
                if (res.data.error)
                    alert(res.data.error);
                else
                    alert("Product listed successfully")
            })
            .catch(err => {
                alert(err)
            });

        this.setState({
            name: '',
            price: '',
            remaining: 0
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.name}
                            onChange={this.onChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="number"
                            min="0"
                            className="form-control"
                            value={this.state.price}
                            onChange={this.onChangePrice}
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity: </label>
                        <input type="number"
                            min="0"
                            className="form-control"
                            value={this.state.remaining}
                            onChange={this.onChangeRemaining}
                        />
                    </div>
                    <hr></hr>

                    <div className="form-group">
                        <input type="submit" value="List product" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}