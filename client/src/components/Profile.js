import React, { Component } from 'react';
import { Row, Col, Avatar, Descriptions, Spin, Button } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';
import background from '../images/stormtrooper.jpg';
import HelperFunctions from '../helpers/helper';
import PostItem from '../components/PostItem';


import '../App.css';
import 'antd/dist/antd.css';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            user: []
        }
    }

    async componentDidMount() {
        var user = await HelperFunctions.getCurrentUser();
        const API = HelperFunctions.getEnvironmentStatus();
        await this.getUserPosts(API, user.username);
        await this.getUserInformation(API, user.username);
    }


    getUserPosts(API, user) {
        fetch(`http://${API}/post/${user}`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json'
            }
          })
        .then(response => response.json())
        .then((res) => this.setState({ posts: res }))
        .catch((err) => console.log(err));
    }
    
    getUserInformation(API, user) {
        fetch(`http://${API}/user/${user}`)
        .then((res) => res.json())
        .then((resp) => this.setState({ user: resp[0] }))
        .catch((err) => console.log(err));
    }

    render() { 
        const { user, posts } = this.state;
        console.log(posts);
        var time = moment(user.createdAt).format('LLL');
        return (  
            user.following === undefined ? 
            <div className="app-container">
                <Spin className="loading" indicator={<LoadingOutlined style={{ fontSize: 240 }} spin />} />
            </div>
            :
            <div className="profile-container">
                <div className="profile-banner">
                    <div className="profile-banner-image" style={{ backgroundImage: `url(${user.profileCover})`}} />
                    <div className="profile-banner-avatar">
                        <Avatar size={200} src={`${user.profilePicture}`}>M</Avatar>
                    </div>
                    
                </div> 
                <div className="profile-data">
                        <Descriptions>
                            <Descriptions.Item> <h1> Name: {user.name} </h1> </Descriptions.Item>
                            <Descriptions.Item> <h1> Username: {user.username} </h1> </Descriptions.Item>
                            <Descriptions.Item> <h1>Posts: {posts.length} </h1> </Descriptions.Item>
                            <Descriptions.Item> <h1>Followers: {user.followers === undefined ? 'loading' : user.followers.length} </h1> </Descriptions.Item>
                            <Descriptions.Item> <h1>Following: {user.following === undefined ? 'loading' : user.following.length} </h1> </Descriptions.Item>
                            <Descriptions.Item> <h1>Date Joined: {time} </h1> </Descriptions.Item>
                            <Descriptions.Item> <Button> <Link to="/profile/edit"> Edit Profile </Link></Button> </Descriptions.Item>
                        </Descriptions>
                    </div>
                <div className="profile-grid">
                    {posts.map(function(post, index) {
                        return (
                            <Row gutter={[16, 16]} id={`row-${index}`} className="profile-grid-row">
                                <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                                <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> <PostItem username={post.username} message={post.message} createdAt={post.createdAt} _id={post._id} /> </Col>
                                <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                            </Row>
                        )
                    })}
                </div>
            </div>
        );
    }
}
 
export default Profile;
