import React, { Component } from 'react';
import S3 from 'react-aws-s3';
import HelperFunctions from '../helpers/helper'
import moment from 'moment';
import { Row, Col, Input, Avatar, Descriptions, Spin, Button, DatePicker, Upload, message, Modal } from 'antd';
import { InboxOutlined, StarOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
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
            pCURL: '',
            disabled: false
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


    handlePicture = (e, name) => {   
        var params = String(e.target.files[0].type);
        var pos = params.indexOf('/');
        var type = params.substring(pos + 1);
        name === 'profile' ? this.setState({ pp: e.target.files[0], ppType: type }) : this.setState({ pC: e.target.files[0], pCType: type });
    }

    handleSubmit = async () => {
        const { pp, ppType, pC, pCType, envVar } = this.state;
        const config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            region: process.env.REACT_APP_BUCKET_REGION,
            accessKeyId: process.env.REACT_APP_S3_KEY,
            secretAccessKey: process.env.REACT_APP_S3_SECRET,
            s3Url: `https://s3.${process.env.REACT_APP_BUCKET_REGION}.amazonaws.com/${process.env.REACT_APP_BUCKET_NAME}`
        }
        

        var profilepicURL = this.state.ppType.lengtth > 0 ? '' : config.s3Url + `/profile-picture-${this.props.username}.${ppType}`;
        var profilecoverURL = this.state.pCType.lengtth > 0 ? '' : config.s3Url + `/profile-cover-${this.props.username}.${pCType}`;
        const Client = new S3(config);
        if(profilepicURL !== '') {
            await Client
            .uploadFile(pp, `profile-picture-${this.props.username}`)
            .then((res) => res.json())
            .then((resp) => console.log("Resp: ", resp))
            .catch(err => console.log(err));
            this.setState({ ppURL: profilepicURL });
        }
        if(profilecoverURL !== '') {
            await Client.uploadFile(pC, `profile-cover-${this.props.username}`)
            .then((res) => res.json())
            .then((resp) => console.log(resp))
            .catch(err => console.log(err));
            this.setState({ pCURL: profilecoverURL });
        }
        await this.handleSaveToDatabase(profilepicURL, profilecoverURL);
        console.log(this.state);
        // window.location.reload();
        var url = `/profile`;
        window.location.href = url;
    }
    
    handleSaveToDatabase = (profilepicURL, profilecoverURL) => {
        const URL = HelperFunctions.getEnvironmentStatus();
        const data = {
            "ppURL": profilepicURL,
            "pCURL": profilecoverURL,
        }
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
        this.setState({ reload: true });
    }

    countDown = () => {
        let secondsToGo = 5;
        const modal = Modal.success({
          title: 'Changing your pictures!',
          content: `This pop-up will close and refresh the page after ${secondsToGo} second.`,
        });
        const timer = setInterval(() => {
          secondsToGo -= 1;
          modal.update({
            content: `This pop-up will close and refresh the page after ${secondsToGo} second.`,
          });
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          modal.destroy();
        }, secondsToGo * 1000);
      }

  
    render() { 
        const { pp, pC } = this.state;
        const dateFormat = "MM/DD/YYYY";
        const props = {
            name: 'file',
            action: 'http://www.mocky.io/v2/5ec40fcb300000ba1339c690',
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return (  
            <div className="edit-profile-container">
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> 
                        <input id="profile-picture-upload" type="file" onChange={(e) => this.handlePicture(e, "profile")}/>
                    </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <br />
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> 
                        <input id="cover-picture-upload" type="file" onChange={(e) => this.handlePicture(e, "cover")}/>
                    </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
                <br />
                <Row gutter={[16, 16]} className="profile-grid-row">
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                    <Col flex="500px" align="middle" span={8} className="profile-grid-col" style={{ minWidth: "300px" }}> 
                        <Button disabled={pp.length === 0 && pC.length === 0 || this.state.disabled} onClick={() => { this.countDown() ;this.handleSubmit(); this.setState({ disabled: true })}}> Upload Pictures </Button>
                    </Col>
                    <Col flex="auto" span={8} className="profile-grid-col grid-col-min" />
                </Row>
            </div>
        );
    }
}
 
export default EditProfile;