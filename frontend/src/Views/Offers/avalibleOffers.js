import React, { Component } from 'react'
import Offer from './offerTile'
import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader';
import cookie from 'react-cookies'
import './avalible-offers.css'

export default class avalibleTrades extends Component {
    state = {
        offers : []
    }

    async fetchOffers(){
        this.setState({waiting:true})
        var res;
        this.props.filter === undefined ? res = await fetch(process.env.REACT_APP_API_URL.concat("/offers")) : res = await fetch(process.env.REACT_APP_API_URL.concat("/user-offers/"+cookie.load("UID")))
        res = await res.json()
        this.setState({offers: res})
        this.setState({waiting:false})
    } 

    btnClick(){
        window.location.replace(process.env.REACT_APP_APP_URL+"/add-offer")
    }

    componentDidMount()
    {
        this.fetchOffers()  
    }

    componentDidUpdate(prevProps) {
        if (this.props.filter !== prevProps.filter) {
            this.fetchOffers() 
        }
      }

    render() {
        return(
            this.state.waiting?
            <Loader/>
            :
            <>
                {this.props.filter !== undefined ? 
                <>
                    <br/>
                    <div className ="center">
                        <button id="addBtn" onClick={this.btnClick}><span className="material-icons">add</span><span className="text">Add an offer</span></button>
                    </div>
                    {
                        this.state.offers.length === 0 ? 
                        <p>It looks like you have <strong>no offers!</strong> <Link to="add-offer">Share a dram</Link> to be able to trade!</p>
                        :
                        this.state.offers.map((offer) => 
                            offer.UID === cookie.load("UID") ?
                            <Link to={"/offer/"+offer._id}>
                                <Offer key={offer._id} img={offer.image} size={offer.size} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>
                            </Link>
                            :
                            null
                        )
                    }
                </>
                :
                <>
                {cookie.load("loggedIn") === "true" ? 
                
                    this.state.offers.map((offer) => (
                        offer.UID === cookie.load("UID") ? 
                        null
                        :
                        <Link to={"/offer/"+offer._id}>
                            <Offer key={offer._id} img={offer.image} size={offer.size} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>
                        </Link>)
                    )
                    :
                    this.state.offers.map((offer) => (
                        <Link to={"/offer/"+offer._id}>
                            <Offer key={offer._id} img={offer.image} size={offer.size} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>
                        </Link>)
                    )
                }
                </>
                }

                
            </>
        )
    }
}
