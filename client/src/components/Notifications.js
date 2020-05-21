import React, { Component } from 'react';
import { Row, Col } from 'antd';
import NotificationItem from './NotificationItem';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() { 
        const { notifications } = this.props;
        console.log(this.props.notifications);
        return (  
            <div className="notifications-container">
                {notifications.map(function(item, index) {
                return (
                    <Row gutter={[16, 16]} id={`row-${index}`} className="home-grid-row">
                        <Col flex="auto" span={8} className="home-grid-col grid-col-min" />
                        <Col flex="500px" align="middle" span={8} className="home-grid-col" style={{ minWidth: "300px" }}> <NotificationItem username={item.username} type={item.type} createdAt={item.createdAt} resolved={item.resolved} /> </Col>
                        <Col flex="auto" span={8} className="home-grid-col grid-col-min" />
                    </Row>
                )
                })}
            </div>
        );
    }
}
 
export default Notifications;