import React from "react";
import Table from "react-bootstrap/Table";
import ReactDOM from 'react-dom'
import GlobalNavigation from "./GlobalNavigation";
import Event from "./Event";


const DetailTable = (props) => {

    return (
        <>
            <div className={'card'} style={{
                width: '100%'
            }}>
                <div className="card-title">
                    <GlobalNavigation username={props.registration.name} />
                </div>
                <div className='card-body'>
                    <Table className={'table-striped, table-responsive'} style={{
                        fontSize: 'small'
                    }}>
                        <DetailTableHeader/>
                        <DetailTableBody registration={props.registration} event_name={props.event_name}/>
                    </Table>
                </div>
            </div>
        </>
    )

}


const DetailTableHeader = (props) => {
    return (
        <thead>
        <tr>
            <th>Event</th>
            <th>Name</th>
            <th>Guests</th>
            <th>Days</th>
            <th>Payment</th>
            <th>payment_Ref</th>
            <th>Arrival</th>
            <th>Arrival Time</th>
            <th>Departure</th>
            <th>Pickup</th>
        </tr>
        </thead>

    )
}

const DetailTableBody = (props) => {
    const arr = Array(props.registration)
    console.log("event_name : ", props.event_name)
    const rows = arr.map((row, index) => {
        return (
            <tr key={index}>
                <td>{props.event_name}</td>
                <td>{row.name}</td>
                <td>{row.num_guests}</td>
                <td>{row.num_days}</td>
                <td>{row.payment_amount}</td>
                <td>{row.payment_ref}</td>
                <td>{row.arrival_date}</td>
                <td>{row.arrival_time}</td>
                <td>{row.departure_date}</td>
                <td>{row.pickup}</td>
            </tr>
        )
    });
    return <tbody>{rows}</tbody>
}

class Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            registration: this.props.registration,
            event_name: this.props.event_name
        }

    }


    render() {
        return (
            <DetailTable events={this.state}
                         registration={this.state.registration}
                         event_name={this.state.event_name}
            />
        );

    }
}

export default Detail
