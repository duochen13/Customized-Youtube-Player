import React from 'react';
import Youtube_Icon from './assets/youtube.svg';
import Headphone_Icon from './assets/headphones.svg';
import { Redirect } from 'react-router-dom';
import { Form, Button, Input } from 'antd';
import { Layout } from 'antd';
import './App.css';
const { Header, Content, Footer } = Layout;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '', // data from '/api/hello
      username: '',
      email: '',
      password: '',
      responseToPost: '', // response from server after post
      redirect: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.callApi('/v1/hello')
      .then(res => this.setState({
        response: res.express
      }))
      .catch(err => console.log(err));

      //redirect instantly
      //this.props.history.push("/login");
  };
  callApi = async(url) => {
    const response = await fetch(url);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/v1/register', {
      method: 'POST', headers: {'Content-Type':'application/json',},
      body: JSON.stringify(
        { 
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
        }
      ),
    })
    this.setState({ redirect: true });
    // this.props.history.push("/user");
    // get response from server '/api/register', to be deleted
    const body = await response.text();
    this.setState({ responseToPost: body});
  };

  render() {
    const path = `/user/${this.state.username}/`;
    return (
      <div>
        <Layout style={{textAlign:'center'}}>
        <Header></Header>
        <Content>
        {/* <h2>response: {this.state.response}</h2> */}
        <br/> <br/> <br/> <br/> 
        <span>
            <img src={Youtube_Icon} alt="Youtube" height="40px" />
            &nbsp; &nbsp; &nbsp;
            <font size="5"><strong>A Customized Online Youtube Video/Music Player</strong></font>
        </span>
        <br/> <br/> <br/> <br/>
        <Form onSubmit={this.handleSubmit} style={{ textAlign: "center" }}>
          <h1> <strong>Registration</strong> </h1>

          <Input type="text" autoFocus value={this.state.username} placeholder="username" 
                 onChange={(e) => {this.setState({username: e.target.value})}}
                 style={{ color: 'rgba(0,0,0,0.8)', 
                 width:200}}></Input> <br/>

          <Input type="text" value={this.state.email} placeholder="email" 
                 onChange={(e) => {this.setState({email: e.target.value})}}
                 style={{ color: 'rgba(0,0,0,0.8)', 
                 width:200}}></Input> <br/>

          <Input type="text" value={this.state.password} placeholder="password" 
                 onChange={(e) => {this.setState({password: e.target.value})}}
                 style={{ color: 'rgba(0,0,0,0.8)', 
                 width:200}}></Input> <br/> <br/>

          <Button htmlType="submit" style={{ textAlign: "center" }}>Register</Button> 
          &nbsp; &nbsp;
          <a href='/login'>Log in</a>
          <p>{this.state.responseToPost}</p>
          {this.state.redirect && (<Redirect to={path} />)}
        </Form>
        <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
        </Content>
        <Footer></Footer>
        </Layout>
      </div>
    );
  }
}

export default Register;

