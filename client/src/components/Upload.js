/**
 * Created by Sundar on 07-09-2020.
 * email tksrajan@gmail.com
 */


import GlobalNavigation from "./GlobalNavigation";
import React from "react";
import ReactDOM from 'react-dom'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios'
import ErrorPage from "./ErrorPage";
import UploadSpinner from "./Spinner";

class Upload extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            media: '',
            uploadMessage:'Upload Media'
        }
    }

    onSubmit = (e) => {
        let formData = new FormData();
        console.log('media=', this.state.media)
        for (const key of Object.keys(this.state.media)) {
            formData.append('file_url', this.state.media[key])
        }
        formData.append('event_name',this.props.event_name)
        let status = 0
        axios.post('/events/upload', formData).then(
            (response) => {
                if (response.status === 200) {
                    status = 200
                    this.setState({
                        uploadMessage: 'Uploaded... Upload again?'
                    })
                    document.getElementById('uploadForm').reset();
                }
            },()=>{
                ReactDOM.render(<ErrorPage username={this.props.username}/>,
                    document.getElementById('app'));
            }
        )

            while(status === 0) {
                ReactDOM.render(<UploadSpinner/>, document.getElementById('spinner'))
            }



    }

    handleChange = (e)=>{

        this.setState({
            media: e.target.files
        });
    }

    render() {
        return (
            <>

                <div>
                    <GlobalNavigation username={this.props.username}/>
                 <p></p>
                   <div className='card-title'>{this.state.uploadMessage}</div>
                    <div className={'card-body'} style={{
                        width: '100%',
                        textAlign: 'left',
                        borderColor: 'azure',
                        borderWidth: '2px',
                        borderStyle: 'solid'
                    }}>
                        <form id='uploadForm'>
                             <Form.Group controlId="mediaUpload">
                                <Form.Control
                                    type="file" multiple
                                    name={"media"}
                                    onChange={this.handleChange}/>
                            </Form.Group>
                        </form>
                            {/*<input type="file" name="media" multiple/>*/}
                        <Button className='btn-primary' type="button" onClick={this.onSubmit}>Upload</Button>


                    </div>
                </div>
            </>

        )


    }
}

export default Upload

