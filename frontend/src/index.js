import React from 'react';
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Header from "./Views/Partials/header"
import Footer from "./Views/Partials/footer"
import SignIn from "./Views/Account/sign-in"
import SignUp from "./Views/Account/sign-up"
import Account from "./Views/Account/account"
import AddOffer from "./Views/Offers/addOffer"
import * as serviceWorker from './serviceWorker'
import AvalibleTrades from './Views/Offers/avalibleTrades'
import Details from "./Views/Offers/details"
import Home from "./Views/home"
import Reset from './Views/Account/reset-password'
import Delivery from './Views/Account/delivery-update'
import Loader from './Components/Loader';

ReactDOM.render(
  <BrowserRouter>
  <React.StrictMode>
    <Header links={[
      {id:0,text:"Your drams", uri:'/your-drams', signInNeeded:true},
      {id:1,text:"Avalible drams", uri:'/browse', signInNeeded:false},
      {id:2,text:"Sign in", uri:'/sign-in', signInNeeded:false},
      {id:3,text:"Avalible drams", uri:'/browse', signInNeeded:true},
      {id:4,text:"Account", uri:'/account', signInNeeded:true},
    ]}/>
    <Switch>
        <Route exact={true} path='/browse' render={() => (
              <div className="App">
                <h2>Avalible for trading</h2>
                <AvalibleTrades filter=""/>
              </div>
            )}/>
        <Route exact={true} path='/your-drams' render={() => (
              <div className="App">
                <h2>Your drams</h2>
                <AvalibleTrades filter={sessionStorage.getItem("UID")}/>
              </div>
            )}/>
        <Route exact={true} path='/account' render={() => (
              <div className="App">
                <Account />
              </div>
            )}/>
        <Route exact={true} path='/sign-in' render={() => (
              <div className="App">
                <SignIn />
              </div>
            )}/>
        <Route exact={true} path='/sign-up' render={() => (
              <div className="App">
                <SignUp />
              </div>
            )}/>
        <Route exact={true} path='/add-offer' render={() => (
          <div className="App">
            <AddOffer />
          </div>
        )}/>
        <Route exact={true} path='/' render={() => (
          <div className="App">
            <Home />
          </div>
        )}/>
        <Route path='/offer/' render={() => (
          <div className="App">
            <Details />
          </div>
        )}/>
        <Route exact={true} path='/forgot' render={() => (
          <div className="App">
            <h1>Forgot your password?</h1>
            <Reset/>
          </div>
        )}/>
        <Route exact={true} path='/update-password' render={() => (
          <div className="App">
            <h1>Change your password</h1>
            <Reset/>
          </div>
        )}/>
        <Route exact={true} path='/update-details' render={() => (
          <div className="App">
            <h1>Change your account details</h1>
            <SignUp/>
          </div>
        )}/>
        <Route exact={true} path='/update-delivery' render={() => (
          <div className="App">
            <Delivery/>
          </div>
        )}/>
        <Route exact={true} path='/loading' render={() => (
          <div className="App">
            <Loader/>
          </div>
        )}/>
      </Switch>
    <Footer/>
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
