import React from 'react'
import ReactDOM from 'react-dom'
import Form from 'react-bootstrap/Form'
import getRemoteApiData from "./Util";
import GlobalNavigation from "./GlobalNavigation";
import Event from "./Event";
import Detail from "./Detail";
import ErrorPage from "./ErrorPage";
import axios from 'axios'
class EventRegistration extends React.Component {

    constructor(props) {
        super(props);
        const {username, eventDate, eventName} = this.props
        console.log('props =>', username, eventDate)
        this.initialState = {
            event_name: eventName,
            name: username,
            payment_amount: '',
            payment_ref: '',
            num_guests: 1,
            num_days: 2,
            mode_of_travel: 'Road',
            arrival_date: eventDate,
            arrival_time: '12:00',
            departure_date: '',
            pickup: 'No',
            err: '',
            registered: undefined

        }

        // this.handleChange.bind(this)
        // this.handleSubmit.bind(this)
        this.state = this.initialState
        console.log('state=', this.state)
    }


    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        });
    }

     sleep =(ms) => {
       return new Promise(resolve => setTimeout(resolve, ms));
}

    postData = (url, formData) => {
         console.log('sending request to ',url,formData);
         return getRemoteApiData(url, formData)
          // axios.post(url, formData).then(
          //     (response) =>{
          //         if(response.status === 200){
          //             return response.data
          //         }
          //     },()=>{
          //         let element = document.getElementById('app');
          //         ReactDOM.render(<ErrorPage usename={this.props.username}/>,element)
          //     }
          // )
    }
    handleSubmit = (event) => {
        console.log('handle submit called  with',event.target.name,event.target.value)
        const err = this.validateForm()
        if (err.length === 0) {
            let element = document.getElementById('registrationForm')
            let formData = new FormData(element)
            console.log('handleSubmit: formData is ', formData)
            let response = getRemoteApiData('/events/create',formData)
            console.log('Response =>',response)
            if(response.update ==='success'){
                ReactDOM.render(<Event username={this.state.name}/>,document.getElementById('app'));
            }else{
                ReactDOM.render(<ErrorPage username={this.state.name}/>,document.getElementById('app'))
            }

        } else {
            this.setState({
                err: err
            })
        }
    }

    validateForm = () => {
        const {payment_amount, payment_ref, arrival_date, departure_date} = this.state
        if (payment_amount.length === 0 || payment_ref.length === 0) {
            return 'payment and payment_ref fields are required'
        }
        const val1 = parseFloat(payment_amount)
        if (isNaN(val1)) {
            return 'Payment amount should be a numeric value'
        }
        const d1 = new Date(arrival_date);
        const d2 = new Date(departure_date);
        if (d1 > d2) {
            return 'Arrival Date can not be later than departure date'
        } else {
            console.log('valid form')
            return ''
        }

    }

    render() {
        const {err} = this.state
        if(this.state.registered===undefined) {
            const data = this.showDetailsIfRegistered();
            if (data !== undefined && data.name === this.state.name) {
                return (
                    <>
                        <Detail username={this.state.name} event_name={this.state.event_name} registration={data}/>
                    </>
                );
            }
        }

        return (
            <>
                <GlobalNavigation username={this.props.username}/>
                <div className={'card'}>
                    <div>
                        <div
                            style={{
                                width: "100%",
                                backgroundColor: "#0f6674",
                                textAlign: "center",
                                color: "white",
                                ontSize: "medium"
                            }}

                        >Register
                        </div>
                        <p style={{
                            color: 'blue',
                            fontSize: 'small',
                            fontStyle: 'italic'
                        }}>All fields are required<br/>
                            {err}
                        </p>
                        <form id={'registrationForm'} style={{
                            textAlign: 'left',
                            height: '80%',
                            marginLeft: '5%',
                            marginRight: '5%',
                            fontSize: 'small',
                        }}>
                            <Form.Group controlId="rEvent">
                                <Form.Label>Event name</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly={true}
                                    name={"event_name"}
                                    value={this.state.event_name}
                                />
                            </Form.Group>
                            <Form.Group controlId="rName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={"name"}
                                    value={this.state.name}
                                    required={true}
                                    onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="rPayment">
                                <Form.Label>Payment</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={"payment_amount"}
                                    value={this.state.payment_amount}
                                    required={true}
                                    onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="rPaymentRef">
                                <Form.Label>Payment Ref</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={"payment_ref"}
                                    value={this.state.payment_ref}
                                    required={true}
                                    onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="rNumGuests">
                                <Form.Label>Number of Guests</Form.Label>
                                <Form.Control as="select"
                                              name={"num_guests"}
                                              value={this.state.num_guests}
                                              required={true}
                                              onChange={this.handleChange}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="rNumDays">
                                <Form.Label>Number of Days</Form.Label>
                                <Form.Control as="select"
                                              name={"num_days"}
                                              value={this.state.num_days}
                                              required={true}
                                              onChange={this.handleChange}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="rMode">
                                <Form.Label>Mode Of travel</Form.Label>
                                <Form.Control as="select"
                                              name={'mode_of_travel'}
                                              required={true}
                                              value={this.state.mode_of_travel}
                                              onChange={this.handleChange}
                                >
                                    <option>Air</option>
                                    <option>Train</option>
                                    <option>Road</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="rArrDate">
                                <Form.Label>Arrival Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name={"arrival_date"}
                                    required={true}
                                    value={this.state.arrival_date}
                                    onChange={this.handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="rArrTime">
                                <Form.Label>Arrival Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name={"arrival_time"}
                                    value={this.state.arrival_time}
                                    required={true}
                                    onChange={this.handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="rDepDate">
                                <Form.Label>Departure Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name={"departure_date"}
                                    value={this.state.departure_date}
                                    onChange={this.handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="rPickup">
                                <Form.Label>Pickup</Form.Label>
                                <Form.Control as="select"
                                              name={'pickup'}
                                              value={this.state.pickup}
                                              onChange={this.handleChange}
                                >
                                    <option>Yes</option>
                                    <option>No</option>

                                </Form.Control>
                            </Form.Group>
                            <a href={'#'} onClick={this.handleSubmit}>Register</a>
                            <p/>
                        </form>
                    </div>
                </div>
            </>

        )

    }

    showDetailsIfRegistered = () => {
            let formData = new FormData();
            formData.append('name', this.state.name);
            formData.append('event_name', this.state.event_name);
            console.log('render: formData is ', formData)
            const data = this.postData('/events/check', formData);
            console.log('data ->', data)
            console.log('data.user ->', data.name)
            if (data.name === this.state.name) {
                console.log('user is registered for the event',this.state.event_name)
                this.state.registered=true;
                 return data;
            }else{
                this.state.registered=false
            }

        return undefined;
    }
}

export default EventRegistration