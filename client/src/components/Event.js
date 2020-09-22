import React from 'react'
import EventTable from "./EventTable";
import {getRemoteApiData} from "./Util";
import Login from "./Login";

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
         const data= await getRemoteApiData('/events',null);
             this.setState({
                 events: data,
             })
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