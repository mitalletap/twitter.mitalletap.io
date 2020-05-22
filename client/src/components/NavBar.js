import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import HelperFunctions from '../helpers/helper';
import { Menu, Avatar, Badge, Spin } from 'antd';
import { BellOutlined, TeamOutlined, HomeOutlined, FormOutlined, ThunderboltOutlined, LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePicture: '',
            notifications: null
        }
    }

    async componentDidMount() {        
        var user = await HelperFunctions.getCurrentUser();
        const API = HelperFunctions.getEnvironmentStatus();
        await this.getUserProfilePicture(API, user.username);
    }

    handleSignout = () => {
        Auth.signOut()
    };

    getUserProfilePicture = async (API, user) => {
        await fetch(`http://${API}/user/${user}`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json'
            }
          })
          .then((res) => res.json())
          .then((resp) => this.setState({ profilePicture: resp[0].profilePicture, notifications: resp[0].notifications === undefined ? 0 : resp[0].notifications.length }))
          .catch(err => console.log(err))
    }
    
    render() { 
        const { notifications, profilePicture }  = this.state;
        return (  
            profilePicture === '' ? 
            <div className="app-container">
                <Spin className="loading" indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
            </div>
            :
            <div className="navbar-container">
                <Menu theme="dark" className="navbar-menu" selectedKeys={[this.state.current]} mode={"vertical"}>
                    <Menu.Item className="navbar-menu-item-profile" key="profile" title={<span> PROFILE </span>}> <Link to="/profile"> <Avatar size={60} src={this.state.profilePicture} className="navbar-menu-item-avatar" />  </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="post"> <Link to="/"> <HomeOutlined style={{ color: "white" }}/> <span className="navbar-title"> HOME </span> </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="friends"> <Link to="/friends"> <TeamOutlined style={{ color: "white" }}/> <span className="navbar-title"> FRIENDS </span> </Link> </Menu.Item>
                    {/* <Menu.Item className="navbar-menu-item" key="notifications"> <Link to="/notifications"> <Badge dot={notifications === 0 ? false : true} offset={[15, 3]}> <BellOutlined style={{ color: "white" }}/>  <span className="navbar-title"> NOTIFICATIONS </span> </Badge> </Link> </Menu.Item> */}
                    <Menu.Item className="navbar-menu-item" key="create-post"> <Link to="/create-post"> <FormOutlined style={{ color: "white" }}/> <span className="navbar-title"> POST </span> </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="sign-out" onClick={this.handleSignout} style={{ bottom: "-45vh" }}> <Link to="/"> <ThunderboltOutlined style={{ color: "white" }}/> <span className="navbar-title"> SIGN OUT </span> </Link> </Menu.Item>
                </Menu>
            </div>
        );
    }
}
 
export default NavBar;