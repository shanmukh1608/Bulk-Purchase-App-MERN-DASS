import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Customer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            choice: -1
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();

        if (event.target.value[0] == "S")
            this.setState({ choice: 0 })
        else if (event.target.value[0] == "V")
            this.setState({ choice: 1 })

    }

    loginStatusCheck() {
        if (localStorage.getItem("type") != "C" && localStorage.getItem("type") != "V") {
            alert("Not logged in! This page is not accessible.")
            return <Redirect to="/login" />
        }
    }

    loginRedirect() {
        if (this.state.choice == 0)
            return <Redirect to="/searchProducts" />
        else if (this.state.choice == 1)
            return <Redirect to="/viewOrders" />
    }

    render() {
        return (
            <div>
                {this.loginStatusCheck()}
                {this.loginRedirect()}
                <form onClick={this.onClick}>
                    <div className="form-group">
                        <input type="button" value="Search all products" className="btn btn-primary" />
                    </div>
                    <div className="form-group">
                        <input type="button" value="View all orders" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}