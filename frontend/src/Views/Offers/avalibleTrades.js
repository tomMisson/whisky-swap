import React, { Component } from 'react'
import Offer from './offerTile'
import {Link} from 'react-router-dom'

export default class avalibleTrades extends Component {

    state = {
        offers : [],
        modalVisibility: false
    }

    async fetchOffers(){
        var res = await fetch(process.env.REACT_APP_API_URL.concat("/offers"))
        res = await res.json()
        this.setState({offers: res})
    } 

    componentWillMount()
    {
        this.fetchOffers()
    }


    render() {
        return(
            <>
                {this.props.filter !== "" ? 
                <>
                    <Link to="add-offer">
                        Add offer +
                    </Link>
                    <br/>
                    {
                        this.state.offers.map((offer) => 
                            offer.UID === sessionStorage.getItem("UID") ?
                            <Offer key={offer._id} img={offer.image} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>
                            :
                            null
                        )
                    }
                </>
                :
                <>
                {
                this.state.offers.map((offer) => {
                        return (<Offer key={offer._id} img={offer.image} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>)
                    })
                }
                </>
                }

                
            </>
        )
    }
}
