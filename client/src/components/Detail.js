import React from "react";
import Table from "react-bootstrap/Table";
import GlobalNavigation from "./GlobalNavigation";


const DetailTable = (props) => {

    return (
        <>
            <div className={'card'} style={{
                width: '100%'
            }}>
                <div>
                <GlobalNavigation username={props.username}/>
                </div>
                <p></p>

                <span>Your registration details for {props.event_name} are given below...</span>

                <div className='card-body'>
                    <Table className='table-striped'>
                        <DetailTableBody registration={props.registration}/>
                    </Table>
                </div>
            </div>
        </>
    )

}

const DetailTableBody = (props) => {
    const {registration} = props
    const keys = Object.keys(registration)
    console.log('keys:', keys)
    let rows = Array()
    keys.forEach((key, index) => {
        let row = <tr key={index}>
            <td>{key}</td>
            <td>{registration[key]}</td>
        </tr>
        console.log('name:value,row', key, registration[key], row)
        rows.push(row)

    });
    console.log(rows)
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
                         username={this.props.username}
            />
        );

    }
}

export default Detail
