import React, { Component } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import aws_exports from './aws-exports';
import { Input, Button } from 'antd';


import './App.css';
import '@aws-amplify/ui/dist/style.css';
import 'antd/dist/antd.css';


const { TextArea } = Input;

Amplify.configure(aws_exports);

const signUpConfig = {
  hiddenDefaults: ["username"],
  defaultCountryCode: '1',
  signUpFields: [{
    label: "Name",
    key: 'name',
    required: true,
    displayOrder: 1,
    type: 'string'
  },
  {
    label: "Username",
    key: 'preferred_username',
    required: true,
    displayOrder: 2,
    type: 'string'
  },
  {
    label: "Data of Birth",
    key: 'birthdate',
    required: true,
    displayOrder: 3,
    type: 'date'
  }
  ]


}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      name: '',
      dob: '',
      email: '',
      phone_number: '',
      message: ''
    }
  }



  componentDidMount() {
    Auth.currentAuthenticatedUser()
    .then((res) => {
      this.setState({ 
        email: res.attributes.email,
        name: res.attributes.name,
        phone_number: res.attributes.phone_number,
        username : res.attributes.preferred_username,
        newUser: ''
      }, () => {
        const { username, name } = this.state;
        const message = {
          name: name,
          username: username
        }
        fetch(`http://localhost:8080/user/${username}`, {
          method: 'POST',
          body: JSON.stringify(message),
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((res) => res.json())
        .catch(err => console.log(err));
      })
    });
  }

  handleChange = (e) => {
    this.setState({ message: e.target.value});
  }

  handleSubmit = () => {
    const { username, message } = this.state;
    const object = {
      username: username,
      message: message
    }
    console.log(object);
    fetch("http://localhost:8080/post/", {
      method: 'POST',
      body: JSON.stringify(object),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((result) => console.log(result))
    .catch(err => console.log(err));
  }



  render() { 
    console.log(process.env.NODE_ENV);
    const { newUser, message } = this.state;
    return (  
      <div className="App-Contianer">
        <Button onClick={() => {this.handleSubmit()}}> Add User </Button>
        <TextArea rows={4} placeholder="Username" onChange={this.handleChange}/>
        <h1> {message} </h1>
      </div>
    );
  }
}
 
export default withAuthenticator(App, { signUpConfig });

