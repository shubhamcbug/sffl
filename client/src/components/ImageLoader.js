import React, {Component} from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import Image from "react-bootstrap/cjs/Image";
import ShowImage from "./ShowImage";
class ImageLoader extends Component{

    constructor(props) {
        super(props);

        this.state = {
            imageUrls: [],
            event_name: this.props.event_name
        };

    }

    componentDidMount() {
        let formData = new FormData();
        formData.append('event_name',this.state.event_name)
        console.log('event_name = ',formData.get('event_name'))
       axios.post('/events/display',formData).
       then((response) =>{
           if(response.status === 200){
               this.setState({
                   imageUrls: response.data
               })
               console.log(this.state.imageUrls)
           }
       })

    }

    showBigPicture = (url) =>{
        ReactDOM.render(<ShowImage url={url}/>,document.getElementById('app'));
    }

    render() {
        // do {
        //     this.sleep(1000)
        // } while (this.state.imageUrls.length === 0)

        const rows = this.state.imageUrls.map((url, index) => {
            return (
                <div className={'card-body'}>
                        <Image src={url} width={'250'} height={'250'}/>
                </div>
            )
        })
        return (
            <div className={'container'} style={{textAlign:'center'}}>
                <div className={'card'}>
                    {rows}
                </div>
            </div>
        )


    }
}

export default ImageLoader