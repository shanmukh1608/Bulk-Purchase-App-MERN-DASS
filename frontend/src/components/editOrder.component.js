import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class editOrder extends Component {

    constructor(props) {

        super(props);

        this.state = {
            username: '',
            id: this.props.location.state.id,
            password: '',
            editFlag: 0
        }
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        let edit = {
            orderid: this.state.id,
            newqty: this.state.quantity
        }

        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        axios.post('http://localhost:4000/customer/editOrder', edit, { headers: headers })
            .then(res => {
                if (res.data.error)
                    alert(res.data.error)
                else
                    alert("Order edited successfully")
                    this.setState({editFlag: 1})
                // window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    ordersRedirect() {
        if (this.state.editFlag == 1)
            return <Redirect to="/viewOrders" />
    }

    render() {
        return (
            <div>
                {this.ordersRedirect()}
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>New quantity: </label>
                        <input type="number" min="1"
                            className="form-control"
                            value={this.state.quantity}
                            onChange={this.onChangeQuantity}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Edit quantity" className="btn btn-primary" />
                    </div>

                </form>
            </div>
        )
    }
}