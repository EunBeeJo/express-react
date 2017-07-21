import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, BrowserRouter, IndexRoute } from 'react-router-dom';
import { App, Home, Login, Register } from 'containers';

const rootElement = document.getElementById('root');
ReactDOM.render(
    <BrowserRouter>
      <div>
        <Route path="/" component={App}/>
        <Route exact path="/" component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
      </div>
    </BrowserRouter>, rootElement
);
