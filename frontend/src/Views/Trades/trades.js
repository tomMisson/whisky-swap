import React, { Component } from 'react'
import Tile from './tradeTile'
import Cookie from 'react-cookies'
import Loader from '../../Components/Loader'
import "./trades.css"

export default class trades extends Component {

    state ={
        offers:[]
    }

    componentDidMount(){
        this.getActiveTrades()
    }

    getActiveTrades = async () => {
        this.setState({waiting:true})
        await fetch(process.env.REACT_APP_API_URL+"/trades-recived/"+Cookie.load("UID"))
            .then(res => res.json())
            .then(res => this.setState({offers:res}))
            .catch(err => console.log(err))
            console.log(this.state)
            this.setState({waiting:false})
    }

    getPastTrades = async () => {
        this.setState({waiting:true})
        await fetch(process.env.REACT_APP_API_URL+"/trades-history/"+Cookie.load("UID"))
            .then(res => res.json())
            .then(res => this.setState({offers:res}))
            .catch(err => console.log(err))
        console.log(this.state)
        this.setState({waiting:false})
    }

    render() {
        return (
            this.state.waiting ?
            <Loader/>
            : 
            <main className="trades">
                <h1>Your trades</h1>
                <div id="tradeToggles">
                    <button onClick={this.getActiveTrades}>Current trades</button><button onClick={this.getPastTrades}>Past trades</button>
                </div>
                {
                    this.state.offers.map((trade)=>
                        <Tile key={trade._id} offeredDramID={trade.offeredDramID}  tradeDramID={trade.forDram}/>
                    )
                }
            </main>
        )
    }
}
