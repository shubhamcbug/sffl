import React from 'react'
import ReactDOM from 'react-dom'
import {getRemoteApiData} from "./Util";
import Login from "./Login";
import Form from "react-bootstrap/Form";
import GlobalNavigation from "./GlobalNavigation";


class NewUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            mobile: '',
            message: ''

        }
        // this.handleChange.bind(this)
        // this.handleSubmit.bind(this)
    }


    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        });

    }
    //  validate_user = ()=>{
    //    let {password, confirmPassword} = this.state
    //      console.log('passwords ', password, confirmPassword)
    //      if (password !== confirmPassword){
    //        this.setState({
    //            message: 'Password and confirm password do not match'
    //        });
    //        return false;
    //      }
    //     return true;
    // }

    handleSubmit = async (event) => {
        console.log('handle submit called...')
        console.log(this)
        const {username, password, email, mobile} = this.state
        let formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('mobile', mobile)
        const error = this.validateFormData(formData)
        console.log('error => ', error)
        if (error != null) {
            console.log('form error')
            this.setState({
                username: '',
                password: '',
                confirmPassword: '',
                email: '',
                mobile: '',
                message: error
            });

        } else {
            const resData = await getRemoteApiData('/events/register', formData)
            console.log('response ->', resData)
            console.log('resData.name, username ->', resData.name,username)
            if (resData.name === username) {
                ReactDOM.render(<Login msg={'Login with new credentials'}/>, document.getElementById('app'));
            }
        }
    }

    render() {
        console.log('rendering new user')
        const err = this.state.message;
        return (
            <>
                <div className={'card'}>
                    <div className='card-title' >
                        <GlobalNavigation nav1={()=>{
                          ReactDOM.render(<Login />,document.getElementById('app'))
                        }} label1={'Login'}/>
                    </div>
                    <div className='card-body'>
                        <div style={{
                            textAlign: 'center',
                            borderColor: 'azure',
                            borderWidth: '2px',
                            borderStyle: 'solid'
                        }}>
                            <div
                                style={{
                                    width: "100%",
                                    backgroundColor: "#D4F8EC",
                                    textAlign: "center",
                                    color: "blue",
                                    ontSize: "medium"
                                }}

                            >Register
                            </div>
                            <form style={{
                                textAlign: 'left',
                                marginLeft: '5%',
                                marginRight: '5%'
                            }}>
                                <Form.Group controlId="newUserName">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={"username"}
                                        value={this.state.username}
                                        onChange={this.handleChange}/>
                                </Form.Group>

                                <Form.Group controlId="newPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name={'password'}
                                        value={this.state.password}
                                        placeholder="Password"
                                        onChange={this.handleChange}/>
                                </Form.Group>

                                <Form.Group controlId="newConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name={'confirmPassword'}
                                        value={this.state.confirmPassword}
                                        placeholder="confirm Password"
                                        onChange={this.handleChange}/>
                                </Form.Group>

                                <Form.Group controlId="newEmail">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name={'email'}
                                        value={this.state.email}
                                        placeholder="Email Address"
                                        onChange={this.handleChange}/>
                                </Form.Group>

                                <Form.Group controlId="newMobile">
                                    <Form.Control
                                        type="text"
                                        name={'mobile'}
                                        value={this.state.mobile}
                                        placeholder="Mobile"
                                        onChange={this.handleChange}/>
                                </Form.Group>

                                 <a href={'#'} className={'card-link'} onClick={this.handleSubmit}>Submit</a>
                            </form>
                            <p style={{color:'red'}}>{err}</p>
                        </div>
                    </div>
                </div>
            </>


        )
    }

    validateFormData(formData) {
        console.log('validating form data...')
        let errorMessage = null;
        if (formData.password !== formData.confirmPassword) {
            console.log('not matched')
            errorMessage = 'Password and Confirm password do not match';
        }
        return errorMessage;
    }
}

export default NewUser