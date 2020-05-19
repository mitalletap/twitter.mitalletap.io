import React, { Component } from 'react';
import HelperFunctions from '../helpers/helper'
import { Avatar } from 'antd';
import moment from 'moment';

class PostItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePicture: ''
        }
    }

    async componentDidMount() {
        await this.getUserProfilePicture();
    }

    getUserProfilePicture = async () => {
        const API = HelperFunctions.getEnvironmentStatus();
        await fetch(`http://${API}/user/profile-images/${this.props.username}`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json'
            }
          })
          .then((res) => res.json())
          .then((resp) => this.setState({ profilePicture: resp.profilePicture}))
          .catch(err => console.log(err))
    }

    render() { 
        var time = moment(this.props.createdAt).format('LLL')  //'MMMM Do YYYY, h:mm:ss'
        return (  
            <div className="post-item-container">
                <div>
                    <Avatar src={this.state.profilePicture}>{this.props.username[0].toUpperCase()}</Avatar>
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