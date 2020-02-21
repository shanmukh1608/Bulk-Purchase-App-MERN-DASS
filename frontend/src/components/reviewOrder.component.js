import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class reviewOrder extends Component {

    constructor(props) {

        super(props);

        this.state = {
            review: '',
            orderid: this.props.location.state.id,
            rating: '',
            reviewFlag: 0
        }

        this.onChangeRating = this.onChangeRating.bind(this);
        this.onChangeReview = this.onChangeReview.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeRating(event) {
        this.setState({ rating: event.target.value });
    }

    onChangeReview(event) {
        this.setState({ review: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        let review = {
            orderid: this.state.orderid,
            review: this.state.review,
            rating: Number(this.state.rating)
        }

        let token = localStorage.getItem('token');

        axios.post('http://localhost:4000/review/reviewOrder', review)
            .then(res => {
                if (res.data.error)
                    alert(res.data.error)
                else
                alert("Review successfully completed")
                this.setState({reviewFlag: 1})
            })
            .catch(err => {
                console.log(err);
            });
    }

    ordersRedirect() {
        if (this.state.reviewFlag == 1)
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
                        <label>Review: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.review}
                            onChange={this.onChangeReview}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit review" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}