import React, { Component } from 'react';
import { Input, Button, Row, Col, notification } from 'antd';
import HelperFunction from '../helpers/helper';
import '../App.css';
import '@aws-amplify/ui/dist/style.css';
import 'antd/dist/antd.css';

const { TextArea } = Input;

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      success: ''
    }
  } 

  handleChange = (e) => {
    this.setState({ message: e.target.value});
  }

  success = type => {
    notification[type]({
      message: 'Tweet Posted',
      description:
        'Tweet successfully posted',
        duration: 4
    });
  };

  failure = type => {
    notification[type]({
      message: 'An error occurred',
      description:
        'Please try again later',
        duration: 4
    });
  };

  handleSubmit = () => {
    const { message } = this.state;
    const { username } = this.props;
    const object = {
      username: username,
      message: message,
      likes: 0,
      dislikes: 0
    }
    const URL = HelperFunction.getEnvironmentStatus();
    fetch(`http://${URL}/post/`, {
      method: 'POST',
      body: JSON.stringify(object),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((resp) => resp === true ? this.setState({ success: true }, () => this.success('success')) : 
    this.setState({ success: false }, () => this.failure('error')))
    .catch(err => console.log(err));
  }

  render() { 
    const { success } = this.state;
    return (  
      <div className="app-container">
        <Row gutter={[16, 16]} className="home-grid-row">
          <Col flex="auto" span={8} className="home-grid-col" style={{ minWidth: "0px" }}/>
          <Col flex="500px" align="middle" span={8} className="home-grid-col" style={{ minWidth: "300px" }}> <h1> Whats on your mind? </h1> </Col>
          <Col flex="auto" span={8} className="home-grid-col" style={{ minWidth: "0px" }}/>
        </Row>
        <Row gutter={[16, 16]} className="home-grid-row">
          <Col flex="auto" span={8} className="home-grid-col" style={{ minWidth: "0px" }}/>
          <Col flex="500px" align="middle" span={8} className="home-grid-col" style={{ minWidth: "300px" }}> <TextArea id="text-area" rows={10} placeholder="Username" onChange={this.handleChange}/> </Col>
          <Col flex="auto" span={8} className="home-grid-col" style={{ minWidth: "0px" }}/>
        </Row>
        <Row gutter={[16, 16]} className="home-grid-row">
          <Col flex="auto" span={8} className="home-grid-col" style={{ minWidth: "0px" }}/>
          <Col flex="500px" align="middle" span={8} className="home-grid-col" style={{ minWidth: "300px" }}> <Button id="submit-button" onClick={() => {this.handleSubmit()}}> Post </Button> </Col>
          <Col flex="auto" span={8} className="home-grid-col" style={{ minWidth: "0px" }}/>
        </Row>
      </div>
    );
  }
}  

export default Post;

