import React from 'react';
import './styles/ListItem.css';
import Player_Icon from './assets/player.svg';
import Delete_Icon from './assets/delete.svg';
import Like_Icon from './assets/like.svg';
import Unlike_Icon from './assets/unlike.svg';
import { Tooltip, Icon } from 'antd';

class SpecialImage extends React.Component {
    render() {
        return(
            <div>
                <img src={this.props.like ? Like_Icon : Unlike_Icon} alt="PUnlike" height="25px" float="left" />
            </div>
        )
    }
}

// videoId, title, index, isPlaying, handleVideoPlay/Delete
class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            like: false,
            selected: null,
        }
        this.handleVideoPlay = this.handleVideoPlay.bind(this);
        this.handleVideoDelete = this.handleVideoDelete.bind(this);
        this.handleVideoLike = this.handleVideoLike.bind(this);
    }

    componentWillMount() {
        const url = `/v1/users/${this.props.username}/playlist/${this.props.videoId}`;
        this.callApi(url)
            .then(resJson => this.setState({
                like: resJson.liked,
            }))
            .catch(err => console.log(err));
        // setTimeout(function() {
        //     alert(3000);
        // }, this.props.wait);
    }
    componentDidMount() {
        setTimeout(() => {
            console.log("3 s! passed");
        }, 3000);
    }
    // componentDidMount(){
    //     alert(this.props.videoId, this.state.like);
    // }
    callApi = async(url) => {
        const response = await fetch(url);
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message);
        }
        return body;
    };
    handleVideoPlay() {
        this.props.handleVideoPlay(this.props.index);
    }
    handleVideoDelete() {
        this.props.handleVideoDelete(this.props.index);
    }
    handleVideoLike() {
        console.log("i fu*king like it!");
        if (!this.state.like) {
            const url = `/v1/users/${this.props.username}/playlist/${this.props.videoId}/like`;
            fetch(url, {
                method:'POST', headers:{'Content-Type':'application/json',},
                body: JSON.stringify(
                    {
                        username: this.props.username, 
                        like_video_id: this.props.videoId,
                        index: this.props.index,
                    }
                ),
            })
            .then(res => res.json())
            .then(responseJson => {
                //alert(responseJson.text());
            }).catch(err => {
                //alert(err);
            }) 
        }
        this.setState((prevState) => ({
            like: !prevState.like,
        }))
    }
    render() {
        // const icon_type = this.props.isPlaying ? "right-circle" : "";
        // const icon_theme = this.props.isPlaying ? "twoTone" : "";
        const icon_type = "right-circle";
        const icon_theme = "twoTone";
        const icon_color = "#52c41a";

        const channel_url = `https://www.youtube.com/channel/${this.props.channelId}`;
        const title = <span>
            <ul>
                <li>
                Title: &nbsp; <strong>{this.props.title}</strong>
                </li>
                <li>
                Channel: &nbsp;
                    <a target="_blank" href={channel_url} rel="noopener noreferrer">
                        {this.props.channelTitle}
                    </a>
                </li>
                <li>
                    Tags: {this.props.tags.map((content) => (' ' + content + ' '))}
                </li>
            </ul>
        </span>
        const icon = this.props.isPlaying ?
                    (
                        <span>
                            {/* <hr /> */}
                            <Icon type={icon_type} theme={icon_theme} twoToneColor={icon_color} spin/>
                        </span>
                    )
                    : (<Icon type={icon_type} theme={icon_theme} />);
        const listitem_style = this.props.isPlaying ? "playing-list-item" : "list-item";
        //arrowPointAtCenter
        return (
            <div className={listitem_style}>
                {/* <Icon type={icon_type} theme={icon_theme} twoToneColor={icon_color} height="30px" /> */}

                &nbsp;&nbsp;&nbsp;
                
                    <Tooltip placement="topLeft" title={title}>
                        <img src={this.props.img_url} alt="video profile"/>
                    </Tooltip> 
                <br />
                <hr />

                {icon}

                &nbsp;&nbsp;&nbsp;
                <span onClick={this.handleVideoPlay}>
                    <img src={Player_Icon} alt="Player" height="25px" float="left" />
                </span>
                &nbsp;&nbsp;&nbsp;

                {/* <span onClick={this.handleVideoLike}>
                    <SpecialImage like={this.state.like} />
                </span> */}
                <span onClick={this.handleVideoLike}>
                    <img src={this.state.like ? Like_Icon : Unlike_Icon} alt="PUnlike" height="25px" float="left" />
                </span>

                &nbsp;&nbsp;&nbsp;
                <span onClick={this.handleVideoDelete}>
                    <img src={Delete_Icon} alt="Delete" height="25px" float="left" />
                </span>
            </div>
        )
    }
}

export default ListItem;

// this.props.event_info, id, finsihed, handleDelete(index), handleRemove(index)
// class ListItem extends React.Component {
//     constructor(props) {
//         super(props);
//         this.handleDelete = this.handleDelete.bind(this);
//         this.handleRemove = this.handleRemove.bind(this);
//         //this.handlePlayVideo = this.handlePlayVideo.bind(this);
//     }
//     handleDelete() {
//         this.props.handleDelete(this.props.id);
//     }
//     handleRemove() {
//         this.props.handleRemove(this.props.id);
//     }
//     render() {
//         const textStyle = {'textDecoration': this.props.finished ? 'line-through' : 'none'};
//         return(
//             <div>
//                 {/* <br /> */}
//                 <span style={textStyle}><strong>id:{this.props.id}, info:{this.props.event_info}&nbsp;&nbsp;</strong></span>
//                 <Button type="danger" onClick={this.props.finished ? this.handleRemove : this.handleDelete}>{this.props.finished ? 'Remove' : 'Delete'}</Button>
//             </div>
//         );
//     }
// }

// export default ListItem;
