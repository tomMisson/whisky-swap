import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Header from "./Views/Partials/header"
import Footer from "./Views/Partials/footer"
import Profile from "./Views/Account/signIn-Up"
import AddOffer from "./Views/Offers/addOffer"
import * as serviceWorker from './serviceWorker';
import AvalibleTrades from './Views/Offers/avalibleTrades';

ReactDOM.render(
  <BrowserRouter>
  <React.StrictMode>
    <Header links={[
      {id:0,text:"Home", uri:'/'},
      {id:1,text:"Account", uri:'/profile'}
    ]}/>
      
        <Route exact={true} path='/' render={() => (
              <div className="App">
                <h2>Avalible for trading</h2>
                <AvalibleTrades />
              </div>
            )}/>
        <Route exact={true} path='/profile' render={() => (
              <div className="App">
                <Profile />
              </div>
            )}/>
        <Route exact={true} path='/offer' render={() => (
          <div className="App">
            <AddOffer />
          </div>
        )}/>
    <Footer/>
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
