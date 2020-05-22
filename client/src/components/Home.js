import React, { Component } from 'react';
import HelperFunction from '../helpers/helper';
import PostItem from './PostItem';
import { Row, Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import '../App.css';
import '@aws-amplify/ui/dist/style.css';
import 'antd/dist/antd.css';

export class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      posts: [],
    }
  }

  async componentDidMount() {
    const URL = HelperFunction.getEnvironmentStatus();
    await this.props.loadUserCredentials()
    this.saveUserToDB(URL);
    this.getAllPosts(URL);
    
  }

  getAllPosts(URL) {
    fetch(`http://${URL}/post/`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then(response => this.setState({ posts: response }))
  }

  saveUserToDB = (URL) => {
    const { username, name } = this.props;
    const message = {
      name: name,
      username: username
    }
    fetch(`http://${URL}/user/${username}`, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((res) => res.json())
    .catch(err => console.log(err));
  }

  render() { 
    const { username } = this.props;
    const { posts } = this.state;
    return (  
      posts.length === 0 ? 
      <div className="app-container">
          <Spin className="loading" indicator={<LoadingOutlined style={{ fontSize: 240 }} spin />} />
      </div> :
      <div className="home-content">
        {posts.map(function(post, index) {
          return (
            <Row gutter={[16, 16]} id={`row-${index}`} className="home-grid-row">
              <Col flex="auto" span={8} className="home-grid-col grid-col-min" />
              <Col flex="500px" align="middle" span={8} className="home-grid-col" style={{ minWidth: "300px" }}> <PostItem username={post.username} message={post.message} createdAt={post.createdAt} _id={post._id} profilePicture={post.profilePicture} likes={post.likes} dislikes={post.dislikes}/> </Col>
              <Col flex="auto" span={8} className="home-grid-col grid-col-min" />
            </Row>
          )
        })}
      </div>
    );
  }
}  

export default Home;