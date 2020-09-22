import React from 'react'
import ReactDOM from 'react-dom'
import Event from "./Event";
import {getRemoteApiData} from "./Util";
import NewUser from "./NewUser";
import Form from 'react-bootstrap/Form'
import GlobalNavigation from "./GlobalNavigation";


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange.bind(this);
        this.handleSubmit.bind(this);
    }


    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        });

    }


    handleSubmit = async (event) => {
        console.log('handle submit called...', event.target)
        let {username, password} = this.state
        console.log('current state', username, password)
        let formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        const loginData = await getRemoteApiData('/events/login', formData)
        console.log('data received by login ', loginData)
        // validate data
        let user = loginData.user;
        let pwd = loginData.password;
        console.log(user, pwd)
        if (user === 'valid' && pwd === 'valid') {
            console.log('user is valid')
            ReactDOM.render(<Event username={this.state.username} />,
                document.getElementById('app'));
        } else if (user === 'invalid') {
            console.log('user is not registered')
            ReactDOM.render(<NewUser/>, document.getElementById('app'));
        } else {
            console.log('password is invalid')
            this.setState({
                message: 'invalid password'
            })
        }
    }

    register = () => {
        console.log('calling new user')
        ReactDOM.render(<NewUser/>, document.getElementById('app'));
    }

    resetPassword = () => {
        ReactDOM.render(<div>Not Implemented</div>, document.getElementById('app'));
    }


    render() {
        const err = this.state.message
        const msg = this.props.msg
        return (
            <>
                <div className={'card'}>
                    <div className={'card-title'}>
                    <GlobalNavigation nav1={this.register} nav2={this.resetPassword} label1={'Register'}
                                      label2={'Reset Password'} label3={this.props.err}/>
                                      </div>

                    <div className={'card-body'} style={{
                        width: '100%',
                        textAlign: 'center',
                        borderColor: 'azure',
                        borderWidth: '2px',
                        borderStyle: 'solid'
                    }}>
                        <div
                            style={{
                                width: "100%",
                                backgroundColor: "lightgrey",
                                textAlign: "center",
                                color: "blue",
                                ontSize: "medium"
                            }}

                        >Login
                        </div>

                        <form style={{
                            textAlign: 'left',
                            marginLeft: '5%',
                            marginRight: '5%'
                        }}>
                            <Form.Group controlId="loginUserName">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={"username"}
                                    value={this.state.username}
                                    onChange={this.handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="loginPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name={'password'}
                                    value={this.state.password}
                                    placeholder="Password"
                                    onChange={this.handleChange}/>
                            </Form.Group>
                            <span>
                   <a href={'#'} className={'card-link'} onClick={this.handleSubmit}>Submit</a>
                    </span>
                        </form>
                        <p style={{color:'red'}}>{err}</p>
                        <p>{msg}</p>
                    </div>
                </div>
            </>

        )
    }
}

export default Login