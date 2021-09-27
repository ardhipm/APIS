import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@material-ui/styles';
// import { ConnectedRouter } from 'connected-react-router'
import { Container, CssBaseline } from '@material-ui/core';
import theme from './Template/Theme';
import { BrowserRouter } from 'react-router-dom';
// import allReducers from './reducers';
// import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store, { history } from './Redux/createStore';
import { ConnectedRouter } from 'connected-react-router'




ReactDOM.render(
  <App />
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
