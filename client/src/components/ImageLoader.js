import React, {Component} from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import Image from "react-bootstrap/cjs/Image";
import ShowImage from "./ShowImage";
import GlobalNavigation from "./GlobalNavigation";
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

    showBigPicture = (e) =>{
        let imageName = e.target.innerHTML
        let url = "/media/media/"+imageName
        console.log(url)
        ReactDOM.render(<ShowImage url={url} username={this.props.username }/>,document.getElementById('app'));
    }

    render() {
        const rows = this.state.imageUrls.map((url, index) => {
            return (
                <div key={index} className={'card-body'}>
                        <Image src={url} width={'250'} height={'250'} /><br/>
                        <span><a href={"#"} onClick={this.showBigPicture}>{url.substring(13,url.length)}</a></span>
                </div>
            )
        })
        return (
            // <div style={{textAlign:'center'}}>
            <>
                <div>
                <GlobalNavigation username={this.props.username}/>
                </div>
                <div className={'card'} style={{borderStyle:"inset",textAlign: 'center'}}>
                    {rows}
                </div>
            {/*// </div>*/}
            </>
        )


    }
}

export default ImageLoader