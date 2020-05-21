import React, { Component } from 'react';
import HelperFunctions from '../helpers/helper';
import { Row, Col, Tabs, Radio, Avatar } from 'antd';

const { TabPane } = Tabs;

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followers: [],
            following: [],
            username: '',
            API: '',
        }
    }


    async componentDidMount() {
        const API = HelperFunctions.getEnvironmentStatus();
        const User = await HelperFunctions.getCurrentUser();
        this.setState({ username: User.username, API: API })
        this.getUserData(API, User.username);
    }

    getUserData(URL, user) {
        fetch(`http://${URL}/user/${user}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((res) => res.json())
        .then((data) => {
            data[0].followers.sort((a, b) => (a.username > b.username) ? 1 : -1)
            data[0].following.sort((a, b) => (a.username > b.username) ? 1 : -1)
            this.setState({ followers: data[0].followers, following: data[0].following })
        })
        .catch((err) => console.log(err));
    }

    render() { 
        const { followers, following, API } = this.state;
        return (  
            <div className="friends-container">
                <Row gutter={[16, 16]} className="home-grid-row">
                    <Col align="middle" span={24}> 
                        <Tabs defaultActiveKey="1" type="card" size={'small'}>
                            <TabPane tab="Followers" key="1">
                                {followers.map(function(follower, index) {
                                    return (
                                        <a href={`http://localhost:3000/u/${follower.username}`}>
                                            <div className="friend-item">
                                                <div className="friend-item-profile-picture">
                                                    <Avatar size={"small"} src={follower.profilePicture}>{follower.username[0].toUpperCase()}</Avatar>
                                                </div>
                                                <div className="friend-item-username">
                                                    <h1> {follower.username} </h1>
                                                </div>
                                            </div>  
                                        </a>
                                    )
                                })}
                            </TabPane>
                            <TabPane tab="Following" key="2">
                                {following.map(function(follower, index) {
                                    return (
                                        <a href={`http://localhost:3000/u/${follower.username}`}>
                                            <div className="friend-item">
                                                <div className="friend-item-profile-picture">
                                                    <Avatar size={"small"} src={follower.profilePicture}>{follower.username[0].toUpperCase()}</Avatar>
                                                </div>
                                                <div className="friend-item-username">
                                                    <h1> {follower.username} </h1>
                                                </div>
                                            </div>  
                                        </a>
                                    )
                                })}
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                
            </div>
        );
    }
}
 
export default Friends;