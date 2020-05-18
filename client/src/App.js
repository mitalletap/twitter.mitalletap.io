import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { Layout, Menu, Input, Button } from 'antd';
import aws_exports from './aws-exports';
import Home from './components/Home';
import Post from './components/Post';
import NavBar from './components/NavBar';
import Friends from './components/Friends';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreators from './actions/rootAction';

import './App.css';
import '@aws-amplify/ui/dist/style.css';
import 'antd/dist/antd.css';

Amplify.configure(aws_exports);
const { Header, Content, Footer, Sider } = Layout;

const signUpConfig = {
  hiddenDefaults: ["username"],
  defaultCountryCode: '1',
  signUpFields: [
    {
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


export class App extends Component {
  constructor(props){
    super(props);
  }
  
  componentDidMount() {
    this.props.loadUserData();
  }

  render() { 
    return (  
      <div className="app-container">
        <Router>
            <Layout className="app-content">
              <Sider breakpoint="lg" collapsedWidth="auto" className="sider-navbar" theme="dark" width={200}>
                  <NavBar {...this.props} />
              </Sider>
              <Layout className="app-center-content">
                <Layout>
                  <Content>
                    <Switch>
                      <Route exact path="/"><Home {...this.props} /></Route>
                      <Route exact path="/friends"><Friends /></Route>
                      <Route exact path="/profile"><Profile /></Route>
                      <Route exact path="/notifications"><Notifications /></Route>
                      <Route exact path="/create-post"><Post {...this.props} /></Route>
                      <Route exact path="/u/:username"><Home /></Route>
                    </Switch>
                  </Content>
                </Layout>
              </Layout>
            </Layout>
          </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
}


// export default withAuthenticator(App, { signUpConfig });
export default withAuthenticator(connect(mapStateToProps, actionCreators)(App), {signUpConfig});