import React from 'react';
import YouTube from 'react-youtube';
import './styles/Schedule.css';
import ListItem from './ListItem';
import PlayModeMenu from './PlayModeMenu';
import Horiscroll from './Horiscroll';
import { API_KEY } from './Constants';

const baseURL = `https://www.googleapis.com/youtube/v3`;

function convert_video_id(link) {
    let video_url = String(link);
    let substr = String(video_url.split("/")[3]);
    let video_id_pre = String(substr.split("?")[1]);
    let video_id = String(video_id_pre.split("=")[1]); // called in YouTube component
    if (video_id.length !== 11) {
        console.log("please enter correct youtube link!");
    }
    return video_id;
}

// props: username
class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temp_user_input: '',
            current_video_index: 0,
            events: [{id: "eNt78mQJavY",
                      title: "SHAUN – Way Back Home (feat. Conor Maynard) [Sam Feldt Edit] (Official Lyric Video)",
                      channelTitle: "Spinnin' Records",
                      channelId: "UCpDJl2EmP7Oh90Vylx0dZtA",
                      tags: ['SpinninSpinnin', 'RecordsSpinnin', 'RecordsSpinninTVspinnin','official'],
                      img_url: 'https://i.ytimg.com/vi/eNt78mQJavY/default.jpg',
                      }
                    ],
            current_mode_key: '2',
        }
        this.handleUserInput = this.handleUserInput.bind(this);
        this.fetch_video_info = this.fetch_video_info.bind(this);
        this.handleAddLink = this.handleAddLink.bind(this);
        // List
        this.handleVideoPlay = this.handleVideoPlay.bind(this);
        this.handleVideoDelete = this.handleVideoDelete.bind(this);
        // video
        this.videoEnd = this.videoEnd.bind(this);
        // video_play_mode corresponds with video
        this.handleVideoPlayMode = this.handleVideoPlayMode.bind(this);
        this.handleModeRepeat = this.handleModeRepeat.bind(this);
        this.handleModeSync = this.handleModeSync.bind(this);
        this.handleModeShuffle = this.handleModeShuffle.bind(this);
        this.handleModeInfinity = this.handleModeInfinity.bind(this);
        // menu
        // this.handleClickMenu = this.handleClickMenu.bind(this);
    }
    componentWillMount() {
        fetch(`/v1/users/${this.props.username}/playlist`)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Response_json: ", responseJson);
                console.log("video_id from server: ", responseJson.video_list);
                const video_list = responseJson.video_list;
                video_list.forEach(video => {
                    console.log("you liked the videl> ", video.liked);
                    this.fetch_video_info(video.video_id);
                })
            }).catch((err) => {
                console.log(err);
            })
    }

    // Local Storage
    // componentDidMount() {
    //     const state = JSON.parse(window.localStorage.getItem("saved_events"));
    //     if (state) {
    //         this.setState({
    //             events: state.event_list,
    //         })
    //     }
    // }
    // componentDidUpdate() {
    //     const state = {
    //         event_list: this.state.events,
    //     }
    //     window.localStorage.setItem("saved_events", JSON.stringify(state));
    // }

    handleUserInput(e) {
        const input_val = e.target.value;
        this.setState({
            temp_user_input: input_val,
        })
        //console.log("user input: ",input_val);
    }
    fetch_video_info(video_id) {
        let finalURl = `${baseURL}/videos/?part=snippet&id=${video_id}&type=video&key=${API_KEY}`;  
        console.log("finalURL: ", finalURl);

        fetch(finalURl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("responseJson: ", responseJson);
                // to be fixed, if in valid input, items.length == 0, error handing
                let title = responseJson.items[0].snippet.title;
                let img_url = responseJson.items[0].snippet.thumbnails.default.url;
                let channelTitle = responseJson.items[0].snippet.channelTitle;
                let channelId = responseJson.items[0].snippet.channelId;
                let tags = responseJson.items[0].snippet.tags.slice(0,5);
                this.setState((prevState) => ({
                    events: [{id: video_id, 
                            title: title,
                            channelTitle: channelTitle,
                            channelId:  channelId,
                            tags: tags,
                            img_url: img_url}, ...prevState.events],
                            current_video_index: 0,

                            // liked: liked
                    //detailed_info: [...prevState.detailed_info, {"channelTitle": channelTitle, "tags": tags}],
                }))
                return responseJson.movies;
            })
            .catch((err) => {
                console.log(err);
            })
    }
    handleAddLink() {
        //console.log("you click add button, userinput is: ", this.state.user_input);
        let video_id = convert_video_id(this.state.temp_user_input);
        this.fetch_video_info(video_id);
    }
    // List
    handleVideoPlay(index) {
        console.log("events: ", this.state.events);
        // let video_id = this.state.events[index];
        // console.log("play the video id: ", video_id);   
        this.setState({
            current_video_index: index,
        })
    }
    handleVideoDelete(index) {
        console.log("------before events-----: ", this.state.events);
        console.log("you want to delete video at(index): ", index);
        console.log("slice(0,index): ", this.state.events.slice(0,index));
        console.log("slice(index + 1): ", this.state.events.slice(index + 1));
        console.log("final events: ", [...this.state.events.slice(0,index), ...this.state.events.slice(index + 1)])
        //const events_length = this.state.events.length;
        if (this.state.events.length === 1) {
            alert("Sorry, you're not allowed to leave playlist empty, you can go to 'Explore' page to add more videos/songs, then delete one, sorry for the inconvenience.")
            return;
        }
        const delete_video = this.state.events[index];
        // delete client side
        if (index < this.state.current_video_index) {
            this.setState((prevState) => ({
                current_video_index: prevState.current_video_index - 1,
                events: [...prevState.events.slice(0, index), ...prevState.events.slice(index + 1)],
            }))
        } else {
            this.setState((prevState) => ({
                events: [...prevState.events.slice(0, index), ...prevState.events.slice(index + 1)],
            }))
        }
        // delete server side
        fetch(`/v1/users/${this.props.username}/playlist/delete`, {
                method: 'DELETE', headers: {'Content-Type':'application/json',},
                body: JSON.stringify({
                    username: this.props.username,
                    delete_video_id: delete_video.id,
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                // to be fixed
                console.log(responseJson.text());
            }).catch(err => console.log(err));

        console.log("------after events----- ", this.state.events);
    }
    // video
    videoEnd() {
        //console.log("current video index : ", this.state.current_video_index, " ends!");
        // it's a way to deal with 'repeat' and 'sync', but 'shuffle'?
        this.setState((prevState) => ({
            current_video_index: prevState.current_video_index + 1,
        }))
        //console.log("next_video_id will be : ", this.state.current_video_index);
        this.handleVideoPlayMode();
    }
    handleVideoPlayMode() {
        let play_mode = this.state.current_mode_key;
        switch(play_mode) {
            case '1': // repeat
                //console.log("current mode key is 1");
                this.setState((prevState) => ({
                    current_video_index: prevState.current_video_index - 1,
                }))
                return '1';
            case '2': // sync
                //console.log("current mode key is 2");
                this.setState((prevState) => ({
                    current_video_index: prevState.current_video_index,
                }))
                //alert("Hi, you have finished the whole playlist, select another song to play! Have a nice day!");
                return '2';
            case '3': // shuffle to be fixed
                // var item = items[Math.floor(Math.random()*items.length)];
                let next_video_index = Math.floor(Math.random() * this.state.events.length);
                if (next_video_index === this.state.current_video_index) {
                    if (next_video_index === this.state.events.length - 1) {
                        next_video_index -= 1;
                    } else {
                        next_video_index += 1;
                    }
                }
                this.setState({
                    current_video_index: next_video_index,
                })
                console.log("next_video_index is :", next_video_index);
                return '3';
            default: // infinity to be fixed
                //console.log("current mode key is 4");
                // to be fixed: check whether the events list is empty
                if (this.state.events.length !== 0) {
                    this.setState({
                        current_video_index: 0,
                    })
                }
                console.log("next_video_index is :", 0);
                return '4';
        }
    }
    handleModeRepeat() {
        this.setState({
            current_mode_key: '1',
        })
        alert("Congrats! you just switch play mode to 'Repeat', Enjoy~");
    }
    handleModeSync() {
        console.log("Sync mode");
        this.setState({
            current_mode_key: '2',
        })
        alert("Congrats! you just switch play mode to 'Synchronization', Enjoy~");
    }
    handleModeShuffle() {
        console.log("Shuffle mode");
        this.setState({
            current_mode_key: '3',
        })
        alert("Congrats! you just switch play mode to 'Shuffle', Enjoy~");
    }
    handleModeInfinity() {
        console.log("Infinity mode");
        this.setState({
            current_mode_key: '4',
        })
        alert("Congrats! you just switch play mode to 'Infinity', Enjoy~");
    }

    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1
            }
        };
        // let { events } = this.state;
        let video_id = this.state.events[this.state.current_video_index].id;

        const list_data = () => this.state.events.map( (obj, index) => {
            return (
            <ListItem key={index} videoId={obj.id} title={obj.title} index={index}
                    img_url={obj.img_url}
                    channelTitle={obj.channelTitle} channelId={obj.channelId} tags={obj.tags}
                    isPlaying={(index === this.state.current_video_index) ? true : false}
                    handleVideoPlay={this.handleVideoPlay}
                    handleVideoDelete={this.handleVideoDelete} 
                    username={this.props.username}
                    />);
        });//map


        return(
            <div >
                <br/>
                <YouTube
                    videoId={video_id}
                    opts={opts}
                    onReady={this._onReady}
                    //onPlay={this.videoPlay}
                    onEnd={this.videoEnd}
                />
                <br />

                <PlayModeMenu handleModeRepeat={this.handleModeRepeat}
                              handleModeSync={this.handleModeSync} 
                              handleModeShuffle={this.handleModeShuffle} 
                              handleModeInfinity={this.handleModeInfinity}
                              current_mode_key={this.state.current_mode_key} />

                <br />
                <br />

                <Horiscroll data={list_data} />
                

            </div>
        )//return
    }//render
    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }
}

export default Schedule;
