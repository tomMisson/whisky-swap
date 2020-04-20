import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Header from "./Views/Partials/header"
import Footer from "./Views/Partials/footer"
import Profile from "./Views/Account/signIn-Up"
//import AddOffer from "./Views/Offers/addOffer"
import * as serviceWorker from './serviceWorker';
//import AvalibleTrades from './Views/Offers/avalibleTrades';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
      <Profile/>
    <Footer/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
