import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'antd';

class NotificationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resolved: null
        }
    }

    async componentDidMount() {
        await this.setState({ resolved: this.props.resolved });
    }


    handleClick = () => [
        this.setState({ resolved: true })
    ]

    render() { 
        var time = moment(this.props.createdAt).format('LLL') 
        return (  
            <div className="notification-item">
                <div className="notification-item-type">
                    <h1> {this.props.type} </h1>
                </div>
                <div className="notification-item-time">
                    <h1> {time} </h1>
                </div>
                <div className="notification-item-resolved">
                    <Button onClick={() => this.handleClick()}> {this.state.resolved === true ? 'Mark as Unread' : 'Mark as Read'} </Button>
                </div>
            </div>
        );
    }
}
 
export default NotificationItem;



