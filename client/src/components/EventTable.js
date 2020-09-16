import React from 'react'
import ReactDOM from 'react-dom'
import Table from 'react-bootstrap/Table'
import EventRegistration from "./EventRegistration";
import Registrations from "./Registrations";
import getRemoteApiData from "./Util";
import GenericTable from "./GenericTable";
import GlobalNavigation from "./GlobalNavigation";
import Event from "./Event";
//
// const registerForEvent= ()=>{
// 	console.log('registerForEvents called')
//     ReactDOM.render(<EventRegistration />,
// 		document.getElementById('app'));
// }

const home = (props) => {
    ReactDOM.render(<Event username={props.username}/>, document.getElementById('app'));
}

const TableHeader = (props) => {

    return (
        // <thead style={{
        //     backgroundColor: "#0f6674",
        //     color: "white"
        // }}>
        <thead>
        <tr>
            <th>Event</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Admin(s)</th>
            <th>Link</th>
            <th>Registrations</th>
        </tr>
        </thead>
    )
}

class TableBody extends React.Component {
    constructor(props) {
        super(props);
    }

    registerForEvent = (e) => {
        const event_name = e.target.innerHTML;
        const selectedEvent = this.getEventDate(event_name)
        ReactDOM.render(<EventRegistration eventName={event_name}
                                           eventDate={selectedEvent.event_date}
                                           event={selectedEvent}
                                           username={this.props.username}
                                           back={home}
            />,
            document.getElementById('app'));
    }

    showRegistrations = (e) => {
        let event_name = document.getElementById('event_name').innerHTML
        console.log('event name =>', event_name)
        let formData = new FormData()
        formData.append('event_name', event_name)
        let regs = getRemoteApiData('/events/registrations', formData)
        ReactDOM.render(<Registrations registrations={regs}
                                       username={this.props.username}/>, document.getElementById('app'));
    }

    render() {
        const rows = this.props.events.map((row, index) => {
                return (
                    <tr key={index}>
                        <td><a href="#" id={'event_name'}
                               onClick={this.registerForEvent}
                               data-toggle="tooltip"
                               title="click to register">{row.event_name}</a></td>
                        <td>{row.event_venue}</td>
                        <td>{row.event_date}</td>
                        <td>{row.event_time}</td>
                        <td>{row.event_description}</td>
                        <td>{row.event_admin}</td>
                        <td><a href={row.event_link} target={"blank"}>Event Details</a></td>
                        <td><a href='#' onClick={this.showRegistrations}>click to view</a></td>

                    </tr>
                )

            }
        );
        return (<tbody>{rows}</tbody>);
    }

    getEventDate = (event_name) => {
        let event = null;
        for (let i = 0; i < this.props.events.length; i++) {
            if (event_name === this.props.events[i].event_name) {
                event = this.props.events[i];
                break;
            }
        }
        return event;
    }


}

const EventTable = (props) => {

    return (
        <>
            <div className={'card'} style={{
                width: '100%'
            }}>
                <div className="card-title">
                    <GlobalNavigation username={props.username} nav1={props.back} label1={props.label}/>
                </div>
                <div className='card-body'>
                    <Table className='table-striped table-responsive' style={{
                        fontSize: 'small'
                    }}>
                        <TableHeader/>
                        <TableBody events={props.events} username={props.username}/>
                    </Table>
                </div>


            </div>
        </>


    )


}


export default EventTable

