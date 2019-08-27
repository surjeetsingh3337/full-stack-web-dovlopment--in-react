import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';

class DishDetail extends Component {
  render() {
    if (this.props.dish) {
      const commentList = this.props.dish.comments.map((comment, i) => (
        <li key={i}>
          {comment.comment}
          <br />
          <br />
          -- {comment.author},{" "}
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit"
          }).format(new Date(Date.parse(comment.date)))}
          <br />
          <br />
        </li>
      ));
      return (
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <Card>
              <CardImg
                top
                src={this.props.dish.image}
                alt={this.props.dish.name}
              />
              <CardBody>
                <CardTitle>{this.props.dish.name}</CardTitle>
                <CardText>{this.props.dish.description}</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-12 col-md-5 m-1">
            <ul>{commentList}</ul>
          </div>
        </div>
      );
    }
    else
      return <div></div>
  }
}

export default DishDetail;
