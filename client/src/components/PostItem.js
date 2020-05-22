import React, { createElement, Component } from 'react';
import HelperFunctions from '../helpers/helper'
import { Avatar, Tooltip, Progress } from 'antd';
import moment from 'moment';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';

class PostItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likes: 0,
            dislikes: 0,
            yourLikes: 0,
            yourDislikes: 0,
            action: 'null',
            loaded: false
        }
    }

    async componentDidMount() {
        this.props.likes === undefined ? await this.setState({ likes: 0 }) : await this.setState({ likes: this.props.likes });
        this.props.dislikes === undefined ? await this.setState({ dislikes: 0 }) : await this.setState({ dislikes: this.props.dislikes });
        await this.getCurrentPostStatus(this.props._id, this.props.username);
    }

    getCurrentPostStatus = async (id, username) => {
        const API = HelperFunctions.getEnvironmentStatus();
        const link = `http://${API}/post/${id}/${username}`;
        console.log(`Sending Get to ${link}`)
        fetch(link, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        }).then((res) => res.json())
        .then((resp) => {
            if(resp.status === 'liked') {
                this.setState({ yourLikes: 1, likes: this.state.likes })
            } else if(resp.status === 'disliked') {
                this.setState({ yourDislikes: 1, dislikes: this.state.dislikes })
            }
            this.setState({ loaded: true });
        })
        .catch(err => console.log(err));
    }

    sendRequest = (id, username, action) => {
        const API = HelperFunctions.getEnvironmentStatus();
        const link = `http://${API}/post/${action}/${id}/${username}`;
        console.log(`Sending Request to ${link}`)
        fetch(link, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        })
        .catch(err => console.log(err));
    } 

    toggleLikes = async () => {
        const { likes, yourLikes, dislikes, yourDislikes, action } = this.state;
        const { username, _id } = this.props;
        if(yourDislikes === 1) {
            await this.setState({ yourDislikes: 0, yourLikes: 1, action: 'liked' });
            this.sendRequest(_id, username, 'liked');
        } else if(yourLikes === 1) {
            await this.setState({ yourDislikes: 0, yourLikes: 0, action: '' });
            this.sendRequest(_id, username, 'null');
        } else {
            await this.setState({ yourDislikes: 0, yourLikes: 1, action: 'liked' });
            this.sendRequest(_id, username, 'liked');
        }
    }

    toggleDislikes = async () => {
        const { likes, yourLikes, dislikes, yourDislikes, action } = this.state;
        const { username, _id } = this.props;
        if(yourLikes === 1) {
            await this.setState({ yourDislikes: 1, yourLikes: 0, action: 'disliked' });
            this.sendRequest(_id, username, 'disliked');
        } else if(yourDislikes === 1) {
            await this.setState({ yourDislikes: 0, yourLikes: 0, action: '' });
            this.sendRequest(_id, username, 'null');
        } else {
            await this.setState({ yourDislikes: 1, yourLikes: 0, action: 'disliked' });
            this.sendRequest(_id, username, 'disliked');
        }    
    }

    calculatePercent = (given, total) => {
        return (given / total ) * 100;
    }
    


    render() { 
        const { likes, dislikes, action, yourDislikes, yourLikes, loaded } = this.state;
        const { username, profilePicture, message } = this.props;
        var time = moment(this.props.createdAt).format('LLL')  //'MMMM Do YYYY, h:mm:ss'
        return (  
            loaded === false ?
            <h1>Loading...</h1> :
            <div className="post-item-container post-item-content">
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
                <div className="post-item-likes-dislikes"> 
                    <span key="comment-basic-like" className="post-item-content" onClick={() => this.toggleLikes()}>
                        <Tooltip title="Like">
                            {(action === "liked" || yourLikes === 1) ? <LikeFilled /> : <LikeOutlined />}
                        </Tooltip>
                        <span className="comment-action">{likes + yourLikes} </span>
                    </span>
                    <span />
                    <span key="comment-basic-dislike" className="post-item-content" onClick={() => this.toggleDislikes()}>
                        <Tooltip title="Dislike">
                            {(action === "disliked" || yourDislikes === 1)  ? <DislikeFilled /> : <DislikeOutlined />}
                        </Tooltip>
                        <span className="comment-action"> {dislikes + yourDislikes}</span>
                    </span>
                </div>
            </div>
        );
    }
}
 
export default PostItem;





                {/* <div>
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
                </div> */}