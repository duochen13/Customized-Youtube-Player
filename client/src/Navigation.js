import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom'

// props: username
class Navigation extends React.Component {
    render() {
        return(
            <div>
                {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }} > */}
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key='1'>
                        <Link to={`/user/${this.props.username}`}><strong>Home</strong></Link>
                    </Menu.Item>
                    <Menu.Item key='2'>
                        <Link to={`/user/${this.props.username}/explore`}><strong>Explore</strong></Link>
                    </Menu.Item>
                    <Menu.Item key='3'>
                        <Link to={`/user/${this.props.username}/favorite`}><strong>Favorite</strong></Link>
                    </Menu.Item>
                    <Menu.Item key='4'>
                        <Link to={'/logout'} ><strong>Logout</strong></Link>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default Navigation;
