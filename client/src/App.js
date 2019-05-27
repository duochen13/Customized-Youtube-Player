import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Register from './Register';
import Login, {Logout} from './Login';
import User from './User';
import Explore from './Explore';
import Favorite from './Favorite';
// import Schedule from './Schedule';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <Route path='/logout' component={Logout} />
{/* 
            <Route path="/" component={Schedule} /> */}
            <Route path="/user/:id/explore" component={(props) => <Explore {...props}/>} />
            <Route path="/user/:id/favorite" component={(props) => <Favorite {...props}/>} />
            <Route path='/user/:id' component={(props) => <User {...props}/>} />

          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

