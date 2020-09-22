import React from "react";
import GenericTable from "./GenericTable";

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
               <GenericTable columns={columns} data={this.state.registrations} username={this.props.username}/>

        );
    }
}

export default Registrations