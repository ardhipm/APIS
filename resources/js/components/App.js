import React from 'react';
import MainRouter from './Template/MainRouter';
import './App.css';
import Login from './Component/Login/Login'
import MainPage from './Template/MainPage';
import { useSelector } from 'react-redux';

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


function App() {

  // const isLogged = useSelector(state => //console.log(state));
  return (

    <React.Fragment>
      <BrowserRouter>
        <Container maxWidth={false} disableGutters={true} style={{overflow : 'hidden'}}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}

            <CssBaseline />
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <React.Fragment>
                  <MainRouter />
                </React.Fragment>
              </ConnectedRouter>
            </Provider>
          </ThemeProvider>

        </Container>
      </BrowserRouter>

    </React.Fragment>


  );
}

export default App;
