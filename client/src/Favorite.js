import React from 'react';
import { Layout } from 'antd';
import Navigation from './Navigation';
const { Header, Content, Footer } = Layout;

//const server_base_url = 'http://localhost:5000';

class Favorite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.match.params ? this.props.match.params.id : 'invalid username',
        }
    }
    render() { 
        return(
            <div>
                <Layout style={{ textAlign: "center" }}>
                    <Header>
                        <Navigation username={this.state.username} />
                    </Header>
                    <Content>
                        {/* <p>username: <strong>{this.state.username}</strong></p> */}
                        {/* <p>email: <strong>{this.state.email}</strong></p> */}
                    </Content>
                    <Footer style={{ textAlign: "center"}}>
                        <small>Customized Youtube Video Player ©2019 Created by Duo, github: duochen97</small>
                    </Footer>
                </Layout>
            </div>
        )
    }
}

export default Favorite;


// handleInputFile(info) {
//     console.log("handleInputFile");
//     // info = event.target
//     const status = info.file.status;
//     if (status !== 'uploading') {
//         console.log(info.file, info.fileList);
//     }
//     console.log(status);
    
//     if (status === 'done') {
//         message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === 'error') {
//         message.error(`${info.file.name} file upload failed.`);
//     }
//     this.setState({
//         selectedFile: info.file,
//     })
//     //console.log("info.file.length: ", this.state.selectedFile);
// }
