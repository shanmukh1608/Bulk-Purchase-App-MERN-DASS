import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

export default class CreateUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isVendor: false
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeUserType = this.onChangeUserType.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeUserType(event) {
        this.setState({ isVendor: true });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            password: this.state.password,
            isVendor: this.state.isVendor
        }

        if (newUser.isVendor) {
            axios.post('http://localhost:4000/vendor/add', newUser)
                .then(res => console.log(res.data));
        }
        else {
            axios.post('http://localhost:4000/customer/add', newUser)
                .then(res => console.log(res.data));
        }

        this.setState({
            username: '',
            password: '',
            isVendor: false
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                    </div>
                    <div className="btn btn-primary">
                        <label>Register as a vendor: &nbsp; </label>
                        <input type="checkbox"
                            className="btn btn-primary"
                            defaultChecked={false}
                            value={this.state.isVendor}
                            onChange={this.onChangeUserType}
                        />
                    </div>
                    <hr></hr>

                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}