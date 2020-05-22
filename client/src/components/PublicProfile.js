import React, { Component } from 'react';
import HelperFunctions from '../helpers/helper';
import { Row, Col, Avatar, Descriptions, Spin, Button } from 'antd';
import moment from 'moment';
import PostItem from '../components/PostItem';
import { LoadingOutlined } from '@ant-design/icons';

class PublicProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            publicUser: '',
            privateUser: '',
            privateUserProfilePicure: '',
            user: [],
            posts: [],
            status: null, 
            API: ''
        }
    }

    async componentDidMount() {
        const API = HelperFunctions.getEnvironmentStatus();
        const User = await HelperFunctions.getCurrentUser();
        await this.setState({ API: API, publicUser: this.props.match.params.username, privateUser: User.username }, () => {
            this.queryDatabaseForUser(API, this.props.match.params.username);
            this.getUserPosts(API, this.props.match.params.username);
            this.checkFollowStatus(API, User.username, this.props.match.params.username);
            this.getCurrentUserProfilePicture();
        });
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

    queryDatabaseForUser = (API, username) => {
        const { publicUser } = this.state;
        const link = `http://${API}/user/${publicUser}`;
        fetch(link, { method: 'GET', headers: { 'content-type': 'application/json' }})
        .then(res => res.json())
        .then((result) => { this.setState({ user: result[0] })})
        .catch((err) => { console.log(err) } );
    }

    checkFollowStatus = (API, currentUser, searchedUser) => {
        const link = `http://${API}/user/check-following-status/${searchedUser}/${currentUser}`;
        fetch(link, { method: 'GET', headers: { 'content-type': 'application/json' }})
        .then((res) => res.json())
        .then((result) => { 
            result.status === true ? 
            this.setState({ status: true }) :
            this.setState({ status: false })
        })
        .catch((err) => { console.log(err) } );
    }

    toggleFollowStatus = () => {
        const { API, publicUser, privateUser, user, privateUserProfilePicure } = this.state;
        const link = `http://${API}/user/add-follower/${privateUser}/${publicUser}`;
        const object = {
            "status": this.state.status,
            "startUserPP": privateUserProfilePicure,
            "endUserPP": user.profilePicture
        }
        fetch(link, {
                method: 'POST',
                body: JSON.stringify(object),
                headers: {
                    'content-type': 'application/json'
                }
        })
        .then(res => res.json())
        .then(resp => this.setState({ status: resp.status }))
        .catch(err => console.log(err));
    }
    
    getCurrentUserProfilePicture = () => {
        const { API, privateUser,  } = this.state;
        const link = `http://${API}/user/profile-images/${privateUser}`;
        fetch(link, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((resp) => {
            this.setState({ privateUserProfilePicure: resp.profilePicture });
        })
        .catch(err => console.log(err));
    }


    render() { 
        const { user, posts, status } = this.state;
        var time = moment(user.createdAt).format('LLL');
        console.log(this.state.user)
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
                        <Avatar size={200} src={user.profilePicture}>{user.username[0].toUpperCase()}</Avatar>
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
                            <Descriptions.Item> <Button onClick={() => this.toggleFollowStatus()}> {status === false ? "Follow" : " Following"} </Button> </Descriptions.Item>
                        </Descriptions>
                    </div>
                <div className="profile-grid">
                    {posts.map(function(post, index) {
                        return (
                            <Row gutter={[16, 16]} id={`row-${index}`} className="pubilc-profile-grid-row">
                                <Col flex="auto" span={8} className="pubilc-profile-grid-col grid-col-min" />
                                <Col flex="500px" align="middle" span={8} className="pubilc-profile-grid-col" style={{ minWidth: "300px" }}> <PostItem username={post.username} message={post.message} createdAt={post.createdAt} _id={post._id} profilePicture={user.profilePicture}/> </Col>
                                <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                            </Row>
                        )
                    })}
                </div>
            </div>
        );
    }
}
 
export default PublicProfile;