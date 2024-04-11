import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
// import Wificamera from './Wificamera';
import * as serviceWorker from './serviceWorker';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ZoningPage } from './Zoning.jsx';
import { SamuelPage } from './Samuel.js';
import { HomePage } from './Home';
import { ModelDetailPage } from './ModelDetail.jsx';
import {store} from './store/index.js'
import testPsyModal from './testPsyModal.jsx';
import { Redirect } from 'react-router';
ReactDOM.render(

  <React.StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path='/' Component={App}>
              <Route path='home' Component={HomePage}/>
              <Route path='zoning' Component={ZoningPage}/>
              <Route path='samuel' Component={SamuelPage}/>
            </Route>
            {/* <Redirect exact from="/" to="home" /> */}
            <Route path='/modelDetail' Component={ModelDetailPage} />
            <Route path='/test' Component={testPsyModal} />
          </Routes>
        </Router>
      </Provider>
    </SnackbarProvider>
  </React.StrictMode>

  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
