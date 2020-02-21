import React, { Component } from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'


export default class vendorReviews extends Component {

    constructor(props) {
        super(props);

        this.state = {
            reviews: [],
            vendorid: this.props.location.state.id,
            vendorname: this.props.location.state.name
        }

        this.state = { reviews: [] }
    }


    componentDidMount() {
        let token = localStorage.getItem('token');
        console.log(token);

        const params = {
            vendorid: this.props.location.state.id
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        const options = { params: params, headers: headers };
        axios.get('http://localhost:4000/customer/vendorReviews', options)
            .then(res => {
                if (res.data.error)
                    alert(res.data.error)
                else
                    this.setState({ reviews: res.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        let vendorname = this.state.vendorname;
        console.log(this.props.location.state.name)
        return (
            <div>
                <h3>{this.props.location.state.name}'s reviews</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Review</th>
                            <th>Rating</th>
                            <th>Vendor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.reviews.map((Review, i) => {
                                return (
                                    <tr key={i}>
                                        { console.log(Review) }
                                        <td>{Review.orderid}</td>
                                        <td>{Review.reviews} </td>
                                        <td>{Review.rating} </td>
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