import React from "react";
import getRemoteApiData from "./Util";
import GenericTable from "./GenericTable";
import GlobalNavigation from "./GlobalNavigation";
class Registrations extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            registrations: this.props.registrations
        }
    }

    render() {
        const columns = [['name', 'name'], ['guests', 'num_guests'],
            ['Days', 'num_days'], ['Payment', 'payment_amount'],['Reference','payment_ref'],
            ['Arrival', 'arrival_date'], ['Time', 'arrival_time'],
            ['Departure', 'departure_date'], ['Reaching by', 'mode_of_travel'], ['Pickup', 'pickup']]


        return(
            <div className='card' style={{
                width:"100%"
            }}>
                <div className='card-title'>
                <GlobalNavigation username={this.props.username}/>
                </div>
                <div className='card-body'>
               <GenericTable columns={columns} data={this.state.registrations}/>
               </div>
            </div>

        );
    }
}

export default Registrations