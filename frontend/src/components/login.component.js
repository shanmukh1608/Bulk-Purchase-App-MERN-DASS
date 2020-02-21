import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            password: this.state.password
        }

        if (newUser) {
            axios.post('http://localhost:4000/login', newUser)
                .then(res => {
                    if (res.data.error)
                        alert(res.data.error)
                    else {
                        localStorage.setItem("token", res.data.token);
                        if (!res.data.type)
                            localStorage.setItem("type", "C");
                        else
                            localStorage.setItem("type", "V");

                        console.log(localStorage.getItem("type"))
                        window.location.reload()
                    }
                });
        }


        this.setState({
            username: '',
            password: ''
        });
    }

    loginRedirect() {
        if (localStorage.getItem("type") == "C")
            return <Redirect to = "/customer" />
        else if (localStorage.getItem("type") == "V")
            return <Redirect to = "/vendor" />
    }

    render() {
        return (
            <div>
                {this.loginRedirect()}
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
                    <hr></hr>

                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}