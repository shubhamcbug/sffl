import React from 'react'
import EventTable from "./EventTable";
import axios from 'axios'
import Login from "./Login";
import GlobalNavigation from "./GlobalNavigation";
import GenericTable from "./GenericTable";
import ReactDOM from "react-dom";


class Event extends React.Component{

      constructor(props) {
        super(props);
        //define an initial state
        this.state = {
            events: [],
            loaded: false,
        }

    }

    componentDidMount = async () => {

         const response= await axios.get('/events');
         if(response.status === 200) {
             this.setState({
                 events: response.data,
                 loaded: true
             })
         }else{
             console.log('error getting events data')
         }
    }



    render() {
           if (this.props.username === undefined){
               return <Login err={'Login first to view events.'}/>
           }
            return (
                <EventTable events={this.state.events} username={this.props.username} back={this.renderLogin} label={'Login'}/>

            );
        }
}
export default Event