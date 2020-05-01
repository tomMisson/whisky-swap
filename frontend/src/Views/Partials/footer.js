import React, { Component } from 'react'
import "./footer.css"

export default class s extends Component {
    render() {
        return (
            <footer>
                <p>Copyright &copy; Tom Misson - {new Date().getFullYear()}</p>
            </footer>
        )
    }
}
