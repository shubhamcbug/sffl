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
            loggedOut: undefined,
            username: this.props.username

        }

        console.log('username in constructor',this.state.username)

    }

    componentDidMount = async () => {

         const response= await axios.get('/events');
         if(response.status === 200) {
             this.setState({
                 events: response.data,
             })
         }else{
             console.log('error getting events data')
         }

    }


    render() {

           console.log('this.state.username =',this.state.username)
          //console.log('this.props.username =',this.props.username)
          console.log('this.state.loggedOut =',this.state.loggedOut)

           if (this.props.username === undefined || this.state.loggedOut===true){
               this.state.loggedOut=false
               return <Login err={'Login to view events.'}/>
           }
            return (
                <EventTable events={this.state.events} username={this.props.username} back={()=>{
                    this.setState({
                        loggedOut: true
                    })
                }} label={'Logout'}/>

            );
        }
}
export default Event