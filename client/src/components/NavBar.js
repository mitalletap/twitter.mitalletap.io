import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Menu, Avatar, Modal, AutoComplete, Input } from 'antd';
import { UserOutlined, BellOutlined, TeamOutlined, HomeOutlined, FormOutlined, ThunderboltOutlined, SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleSignout = () => {
        Auth.signOut()
    };

    render() { 
        return (  
            <div className="navbar-container">
                <Menu theme="dark" className="navbar-menu" selectedKeys={[this.state.current]} mode={"vertical"}>
                    <Menu.Item className="navbar-menu-item-profile" key="profile"> <Link to="/profile"> <Avatar size={60} className="navbar-menu-item-avatar"></Avatar> </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="post"> <Link to="/"> <HomeOutlined style={{ color: "white" }}/> <span className="navbar-title"> HOME </span> </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="friends"> <Link to="/friends"> <TeamOutlined style={{ color: "white" }}/> <span className="navbar-title"> FRIENDS </span> </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="notifications"> <Link to="/notifications"> <BellOutlined style={{ color: "white" }}/> <span className="navbar-title"> NOTIFICATIONS </span> </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="create-post"> <Link to="/create-post"> <FormOutlined style={{ color: "white" }}/> <span className="navbar-title"> POST </span> </Link> </Menu.Item>
                    <Menu.Item className="navbar-menu-item" key="sign-out" onClick={this.handleSignout} style={{ bottom: "-45vh" }}> <Link to="/"> <ThunderboltOutlined style={{ color: "white" }}/> <span className="navbar-title"> SIGN OUT </span> </Link> </Menu.Item>
                </Menu>
            </div>
        );
    }
}
 
export default NavBar;