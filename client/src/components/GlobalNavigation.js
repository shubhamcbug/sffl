import React from 'react'
import ReactDOM from 'react-dom'
import Event from "./Event";
import MyComponent from "./ImageLoader";

class GlobalNavigation extends React.Component {
    constructor(props) {
        super(props);
        console.log('nav1 and label1 ', props.nav1, props.label1)
    }

    home = () => {
        ReactDOM.render(<Event username={this.props.username}/>, document.getElementById('app'))
    }

    showMedia = () => {
       ReactDOM.render(<MyComponent/> , document.getElementById('app'))
    }

    render() {
        const fn = this.props.nav1 === undefined ? this.home : this.props.nav1
        const label = this.props.label1 === undefined ? "Home" : this.props.label1
        return (
            <div style={{
                alignSelf: "inherit",
                textAlign: 'right',
                width: '100%',
                backgroundColor: "lightgrey"
            }}> {this.props.username}
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item" style={{margin:"5 px"}}>
                        <a className="nav-link" href="#" onClick={fn}>{label}</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={this.props.nav2}>{this.props.label2}</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" style={{color: 'red'}}>{this.props.label3}</a>
                    </li>
                </ul>
              {/*  <img src='https://homepages.cae.wisc.edu/~ece533/images/sails.png' width='100' height='100'/>*/}
              {/*<a style={{textAlign:"right"}} href={"#"} onClick={this.showMedia}>View Media</a>*/}
            </div>
        );
    }

}

export default GlobalNavigation