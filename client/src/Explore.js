import React from 'react';
import { Input, Layout, Alert, Button, Form } from 'antd';
import { API_KEY } from './Constants';
import Youtube_Icon from './assets/youtube.svg';
import Search_Icon from './assets/search.svg';
import YouTube from 'react-youtube';
// import { Link } from 'react-router-dom';
import Navigation from './Navigation';


const { Header, Content, Footer } = Layout;

const baseURL = `https://www.googleapis.com/youtube/v3`;

var assert = require('assert');         

// handleAddVideo

// props: username, video_id, handleAddVideo()
class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: this.props.username, select:false };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    callApi = async(url) => {
        const response = await fetch(url);
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message);
        }
        return body;
    };
    // add to playList
    handleSubmit(e) {
        e.preventDefault();
        this.setState({ select: true});
        this.props.handleAddVideo(this.props.video_id);
        //alert(`video ${this.props.video_id} has been added to your playlist, enjoy!`);
    }
    render() {
        const opts = {
            height: '400',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 0
            }
        };
        return(
            <div align="center">
                <YouTube 
                    videoId={this.props.video_id}
                    opts={opts}
                ></YouTube>
                {this.state.select ? 
                    <Alert message="Successfully Added" type="success" style={{width:200}} showIcon /> :
                    <Form onSubmit={this.handleSubmit}>
                        <Button htmlType="submit">Add to PlayList</Button>
                    </Form>
                }

                <br />
                {/* <Link to={{pathname: `/user/${this.props.username}`, query: this.props.video_id}} ><Button>Add to playlist</Button></Link> */}
            </div>
        )
    }
}

class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temp_user_input: '', 
            videos: [],
            username: this.props.match.params ? this.props.match.params.id : 'invalid username',
        }
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleAddVideo = this.handleAddVideo.bind(this);
        //this.handleAddToPlayList = this.handleAddToPlayList.bind(this);
    }
    componentDidMount() {
        //console.log("componentDidMount...");
        const state = JSON.parse(window.localStorage.getItem("saved_videos"));
        //console.log("attention state: ", state);
        if (state) {
            this.setState({
                videos: state.video_list,
            })
        }
    }
    componentDidUpdate() {
        //console.log("componentDidUpdate...");
        const state = {
            video_list: this.state.videos,
        }
        window.localStorage.setItem("saved_videos", JSON.stringify(state));
    }
    handleAddVideo(video_id) {
        console.log("videoid that you want to add to the playlist: ", video_id);
        const url = `/v1/users/${this.state.username}/playlist/add`;
        fetch(url, {
            method: 'POST', headers: {'Content-Type':'application/json',},
            body: JSON.stringify(
                {
                    username: this.state.username, 
                    add_video_id: video_id,
                }
            )
        }).then((response) => response.json());
        //// above to be fixed
    }
    handleUserInput(e) {
        this.setState({
            temp_user_input: e.target.value,
        })
        //console.log("userinput: ", e.target.value);
    }
    handleSearch() {
        let userInput = this.state.temp_user_input;
        let finalURL = `${baseURL}/search?part=snippet&q=${userInput}&type=video&key=${API_KEY}`;
        fetch(finalURL)
            .then((response) => response.json())
            .then((responseJson) => {
                assert(responseJson.items.length === responseJson.pageInfo.resultsPerPage);
                this.setState({
                    videos: [],
                })
                responseJson.items.map((item, index) => {
                    console.log("video.title: ",item.snippet.title);
                    this.setState((prevState) => ({
                        videos: [...prevState.videos, {"id": item.id.videoId.toString(), "title": item.snippet.title.toString()}],
                    }));
                    // this.setState({
                    //     videos: [{"id": "eNt78mQJavY" , "title": "-RtX9aV-P8k"}],
                    // })

                    return responseJson.items;
                });
                console.log("responseJson: ", responseJson);
            })
            .catch((err) => console.log(err));
        console.log("finalUrl: ", finalURL);
    }
    render() {
        // const opts = {
        //     height: '400',
        //     width: '640',
        //     playerVars: { // https://developers.google.com/youtube/player_parameters
        //       autoplay: 0
        //     }
        // };
        return(
            <div>
                <Layout style={{ textAlign: "center" }}>
                    <Header>
                        <Navigation username={this.state.username}/>
                    </Header>

                    <Content>
                        <br />
                        <img src={Youtube_Icon} alt="Youtube" height="40px"  />
                        &nbsp;&nbsp;&nbsp;
                        <Input className="input-type-order" size="default" type="textarea"
                                placeholder="Search for songs available on youtube :)"
                                onChange={this.handleUserInput} onPressEnter={this.handleSearch}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {/* <Button onClick={this.handleSearch}> Search </Button> */}
                        <span onClick={this.handleSearch}>
                            <img src={Search_Icon} alt="Search" height="40px" float="left" />
                        </span>

                        <br />
                        <br />
            
                        {this.state.videos.map((obj, index) => (
                            <Video key={index} username={this.state.username} video_id={obj.id} handleAddVideo={this.handleAddVideo}/>
                        ))}
                    </Content>

                    <Footer style={{ textAlign: "center"}}>
                        <small>Customized Youtube Video Player ©2019 Created by Duo, github: duochen97</small>
                    </Footer>
                </Layout>
            </div>
        )
    }
}

export default Explore;
