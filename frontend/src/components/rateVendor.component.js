import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class rateVendor extends Component {

    constructor(props) {

        super(props);

        this.state = {
            username: '',
            vendorname: this.props.location.state.vendorname,
            password: '',
            rateFlag: 0
        }
        this.onChangeRating = this.onChangeRating.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeRating(event) {
        this.setState({ rating: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        let rate = {
            vendorname: this.state.vendorname,
            rating: Number(this.state.rating)
        }

        let token = localStorage.getItem('token');

        axios.post('http://localhost:4000/customer/rateVendor', rate)
            .then(res => {
                if (res.data.error)
                    alert(res.data.error)
                else
                    alert("Rated vendor successfully")
                    this.setState({rateFlag: 1})
            })
            .catch(err => {
                console.log(err);
            });
    }

    ordersRedirect() {
        if (this.state.rateFlag == 1)
            return <Redirect to="/viewOrders" />
    }

    render() {
        return (
            <div>
                {this.ordersRedirect()}
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Rating (1-5)</label>
                        <input type="number" min="1" max="5"
                            className="form-control"
                            value={this.state.rating}
                            onChange={this.onChangeRating}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Rate vendor" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}