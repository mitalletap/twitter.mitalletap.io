import React, { Component } from 'react';
import S3 from 'react-aws-s3';
import HelperFunctions from '../helpers/helper'
import moment from 'moment';
import { Row, Col, Input, Avatar, Descriptions, Spin, Button, DatePicker } from 'antd';



class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dob: '',
            image: '',
            backgroundImage: '',
            pp: [],
            ppType: '',
            ppURL: '',
            pC: [],
            pCType: '',
            pCURL: ''
        }
    }



    componentDidMount() {
        var envVar = HelperFunctions.getEnvironmentStatus();
        this.setState({ envState: envVar })
    }

    fieldsComplete = () => {
        const { dob, pp, pC } =  this.state;
        return pp.length === 0 && pC.length === 0 && dob.length === 0;
    } 

    handleName = e => {
        this.setState({ name: e.target.value })
    } 

    handleDate = e => {
        var time = e === null ? "null" : moment(String(e._d)).format('L')
        console.log(time);
    } 

    handleProfilePicture = e => {
        var params = String(e.target.files[0].type);
        var pos = params.indexOf('/');
        var type = params.substring(pos + 1);
        this.setState({ pp: e.target.files[0], ppType: type }, console.log(e.target.files[0]));
    }

    handleProfileCover = e => {
        var params = String(e.target.files[0].type);
        var pos = params.indexOf('/');
        var type = params.substring(pos + 1);
        this.setState({ pC: e.target.files[0], pCType: type });
    }

    handleSubmit = async () => {
        const { pp, ppType, ppURL, pC, pCType, pCURL } = this.state;
        console.log(this.state);
        const config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            region: process.env.REACT_APP_BUCKET_REGION,
            accessKeyId: process.env.REACT_APP_S3_KEY,
            secretAccessKey: process.env.REACT_APP_S3_SECRET,
            s3Url: `https://s3.${process.env.REACT_APP_BUCKET_REGION}.amazonaws.com/${process.env.REACT_APP_BUCKET_NAME}`
        }

        var profilepicURL = this.state.pp.length > 0 ? '' : config.s3Url + `/profile-picture-${this.props.username}.${ppType}`;
        var profilecoverURL = this.state.pC.length > 0 ? '' : config.s3Url + `/profile-cover-${this.props.username}.${pCType}`;
        console.log(profilepicURL);
        console.log(profilecoverURL);

        const Client = new S3(config);
        if(profilepicURL !== '') {
            console.log("Saving Profile Picture");
            await Client.uploadFile(pp, `profile-picture-${this.props.username}`)
            .then((res) => res.json())
            .then((resp) => console.log(resp))
            .catch(err => console.log(err));
            this.setState({ ppURL: profilepicURL });
        }
        if(profilecoverURL !== '') {
            console.log("Saving Cover Photo");
            await Client.uploadFile(pC, `profile-cover-${this.props.username}`)
            .then((res) => res.json())
            .then((resp) => console.log(resp))
            .catch(err => console.log(err));
            this.setState({ pCURL: profilecoverURL });
        }

        console.log("Done Saving Images");
        var done = await this.handleSaveToDatabase(profilepicURL, profilecoverURL);
        console.log(done);
    }
    

    handleSaveToDatabase = (profilepicURL, profilecoverURL) => {
        console.log("Saving to Database");
        // const { pp, ppType, ppURL, pC, pCType, pCURL } = this.state;
        const URL = HelperFunctions.getEnvironmentStatus();
        const data = {
            "ppURL": profilepicURL,
            "pCURL": profilecoverURL,
        }
        console.log(data);
        const API= `http://${URL}/user/update/${this.props.username}`;
        fetch(API, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((resp) => resp.length > 0 ? this.setState({ finished: true }) : this.setState({ finished: false }))
        .catch((err) => console.log(err));
    }

    render() { 
        const dateFormat = "MM/DD/YYYY";
        return (  
            <div className="edit-profile-container">
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> <h1> Edit Profile </h1> </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> <Input placeholder="Name" onChange={this.handleName}/> </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> <DatePicker onChange={this.handleDate} format={dateFormat} /></Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> 
                        <input accept="image/*" id="icon-button-file" type="file" onChange={this.handleProfilePicture} />
                    </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> 
                        <input accept="image/*" id="icon-button-file" type="file" onChange={this.handleProfileCover} />
                    </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> 
                        <Button onClick={this.handleSubmit} disabled={this.fieldsComplete()}> Submit </Button>
                    </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <h1> HELLO </h1>
                {this.state.fileType}
            </div>
        );
    }
}
 
export default EditProfile;