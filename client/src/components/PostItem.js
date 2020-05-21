import React, { Component } from 'react';
import HelperFunctions from '../helpers/helper'
import { Avatar } from 'antd';
import moment from 'moment';

class PostItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() { 
        var time = moment(this.props.createdAt).format('LLL')  //'MMMM Do YYYY, h:mm:ss'
        return (  
            <div className="post-item-container">
                <div>
                    <a href={`http://localhost:3000/u/${this.props.username}`}> <Avatar src={this.props.profilePicture}>{this.props.username[0].toUpperCase()}</Avatar> </a>
                </div>
                <div className="post-item-time">
                    <h1> {time} </h1>
                </div>
                <div className="post-item-message">
                    <h1> {this.props.message} </h1>
                </div>
                <div className="post-item-username">
                    <h1 className="post-item-username"> @{this.props.username} </h1>
                </div>
            </div>
        );
    }
}
 
export default PostItem;