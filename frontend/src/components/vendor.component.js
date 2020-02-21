import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Vendor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            choice: -1
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        if (event.target.value) {
            if (event.target.value[0] == "L")
                this.setState({ choice: 0 })
            else if (event.target.value[9] == "c")
                this.setState({ choice: 1 })
            else if (event.target.value[9] == "p")
                this.setState({ choice: 2 })
            else if (event.target.value[9] == "d")
                this.setState({ choice: 3 })
        }
    }

    loginStatusCheck() {
        if (localStorage.getItem("type") != "C" && localStorage.getItem("type") != "V") {
            alert("Not logged in! This page is not accessible.")
            return <Redirect to="/login" />
        }
    }

    loginRedirect() {
        if (this.state.choice == 0)
            return <Redirect to="/listProduct" />
        else if (this.state.choice == 1)
            return <Redirect to="/viewListings" />
        else if (this.state.choice == 2)
            return <Redirect to="/readyListings" />
        else if (this.state.choice == 3)
            return <Redirect to="/dispatchListings" />
    }

    render() {
        return (
            <div>
                {this.loginStatusCheck()}
                {this.loginRedirect()}
                <form onClick={this.onClick}>
                    <div className="form-group">
                        <input type="button" value="List new product" className="btn btn-primary" />
                    </div>
                    <div className="form-group">
                        <input type="button" value="View all current product listings" className="btn btn-primary" />
                    </div>
                    <div className="form-group">
                        <input type="button" value="View all products ready to dispatch" className="btn btn-primary" />
                    </div>
                    <div className="form-group">
                        <input type="button" value="View all dispatched products" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}