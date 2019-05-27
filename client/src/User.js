import React from 'react';
import { Layout } from 'antd';
import Schedule from './Schedule';
import Navigation from './Navigation';
const { Header, Content, Footer } = Layout;


class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.match.params ? this.props.match.params.id : 'invalid username',
            email: '',
        }
    }
    componentDidMount() {
        const { username } = this.state;
        this.callApi(`/v1/users/${username}`)
            .then(res => this.setState({
                email: res.email,
            }))
            .catch(err => console.log(err));
    }
    callApi = async(url) => {
        const response = await fetch(url);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    }
    render() {
        return (
            <div>
                <Layout style={{ textAlign: "center" }}>
                    <Header>
                        <Navigation username={this.state.username} />
                    </Header>
                    <Content> <br/>
                        <p>username: <strong>{this.state.username}</strong></p>
                        <p>email: <strong>{this.state.email}</strong></p>
                        {/* <a href="/logout">Logout</a> */}
                        <Schedule username={this.state.username} />
                    </Content>
                    <br /><br/><br/><br/>
                    <Footer style={{ textAlign: "center"}}>
                        <small>Customized Youtube Video Player ©2019 Created by acornchen</small>
                    </Footer>
                </Layout>
            </div>
        )
    }
}

// const User = ({match}) => {
//     var id = undefined;
//     if (match.params){
//         //id = parseString(match.params.id);
//         id = match.params.id; // username
//     }  
//     return(
//         <div>
//             <h1>This is user!</h1>
//             <p>username: <strong>{id}</strong></p>
//         </div>
//     )
// };


export default User;

