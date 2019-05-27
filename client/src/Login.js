import React from 'react';
import Youtube_Icon from './assets/youtube.svg';
import Headphone_Icon from './assets/headphones.svg';
import {Redirect} from 'react-router-dom';
import {Form, Button, Input} from 'antd';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;


export class Logout extends React.Component {
    render() {
        return(
            <div>
                <Redirect to='/login' />
            </div>
        )
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            match: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/v1/login', {
            method: 'POST', headers: {'Content-Type':'application/json',},
            body: JSON.stringify(
                { username: this.state.username,
                  password: this.state.password } ),
        })
        // get response from server '/api/login'
        const body = await response.json();
        if (body.match) {
            this.setState({ match: true });
        }
        //this.setState({ match: body.match });
    }
    render() {
        const {match} = this.state;
        const path = `/user/${this.state.username}/`;
        return (
            <div >
                <Layout style={{textAlign:'center'}}>
                <Header></Header>
                <Content>
                <br/> <br/> <br/> <br/> 
                <span>
                    <img src={Youtube_Icon} alt="Youtube" height="40px" />
                    &nbsp; &nbsp; &nbsp;
                    <font size="5"><strong>A Customized Online Youtube Video/Music Player</strong></font>
                </span>
                <br/> <br/> <br/> <br/>
                {/* <Spin >
                </Spin> */}
                <Form onSubmit={this.handleSubmit} >
                    <img src={Headphone_Icon} alt="Headphone" height="40px" float="left"></img>
                    &nbsp; &nbsp; &nbsp;
                    <font size="5"><strong>Log in</strong></font>
                    <br /> <br/>
                    <Input type="text" autoFocus value={this.state.username} placeholder="username" 
                            onChange={(e) => {this.setState({username: e.target.value})}}
                            style={{ color: 'rgba(0,0,0,0.8)', width:200}} ></Input> <br/>

                    <Input className="ant-input" type="text" value={this.state.password} placeholder="password" 
                            onChange={(e) => {this.setState({password: e.target.value})}} 
                            style={{ color: 'rgba(0,0,0,0.8)', width:200, show:'hide'}}></Input> <br/> <br/>

                    <Button htmlType="submit"><strong>Login</strong></Button>
                    {/* <p>match? {match ? "password match" : "doest not match"}</p> */}
                    {match && (<Redirect to={path} />)} &nbsp; &nbsp;
                    <a href='/register'><strong>Sign up</strong></a>
                </Form>
                <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
                </Content>
                <Footer style={{ textAlign: "center"}}>
                    <small>Customized Youtube Video Player ©2019 Created by acornchen, contact: acornchen2@gmail.com</small>
                </Footer>
                <Header></Header>
                </Layout>
            </div>
        )
    }
}

export default Login;
