import React from 'react';
import { Menu, Icon, Dropdown } from 'antd';
import Repeat_Icon from './assets/repeat.svg';
import Infinity_Icon from './assets/infinity.svg';
import Shuffle_Icon from './assets/shuffle.svg';
import Sync_Icon from './assets/sync.svg';
import './styles/PlayModeMenu.css';

// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;

class PlayModeMenu extends React.Component {
    constructor(props) {
        super(props);
        this.handleModeRepeat = this.handleModeRepeat.bind(this);
        this.handleModeSync = this.handleModeSync.bind(this);
        this.handleModeShuffle = this.handleModeShuffle.bind(this);
        this.handleModeInfinity = this.handleModeInfinity.bind(this);
    }
    handleModeRepeat() {
        this.props.handleModeRepeat();
    }
    handleModeSync() {
        this.props.handleModeSync();
    }
    handleModeShuffle() {
        this.props.handleModeShuffle();
    }
    handleModeInfinity() {
        this.props.handleModeInfinity();
    }
    render() {
        const mode_icons = [Repeat_Icon, Sync_Icon, Shuffle_Icon, Infinity_Icon];
        const menu = (
            <Menu>
                <Menu.Item key="1" onClick={this.handleModeRepeat}>
                    Repeat
                    &nbsp;&nbsp;&nbsp;
                    <img src={Repeat_Icon} alt="repeat" height="30px" float="left" />
                </Menu.Item>
                <Menu.Item key="2" onClick={this.handleModeSync}>
                    Sync
                    &nbsp;&nbsp;&nbsp;
                    <img src={Sync_Icon} alt="sync" height="30px" float="left" />
                </Menu.Item>
                <Menu.Item key="3" onClick={this.handleModeShuffle}>
                    Shuffle
                    &nbsp;&nbsp;&nbsp;
                    <img src={Shuffle_Icon} alt="shuffle" height="30px" float="left" />
                </Menu.Item>
                <Menu.Item key="4" onClick={this.handleModeInfinity}>
                    Infinity
                    &nbsp;&nbsp;&nbsp;
                    <img src={Infinity_Icon} alt="infinity" height="30px" float="left" />
                </Menu.Item>      
            </Menu>
        )
        return(
            // <Layout className="play-mode-menu">
            // </Layout>      
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="#" >
                    <img src={mode_icons[parseInt(this.props.current_mode_key) - 1]} alt="current_mode" height="30px" float="left" />
                    &nbsp;&nbsp;&nbsp;
                    <strong>Play Mode</strong> <Icon type="down" />
                    &nbsp;&nbsp;&nbsp;
                </a>
            </Dropdown>
        )
    }
}

export default PlayModeMenu;
