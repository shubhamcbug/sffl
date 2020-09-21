/**
 * Created by Sundar on 07-09-2020.
 * email tksrajan@gmail.com
 */

import React, {Component} from "react";
import Image from "react-bootstrap/Image";
import GlobalNavigation from "./GlobalNavigation";

class ShowImage extends Component{
    constructor(props) {
        super(props);

    }

    render() {

        return(
            <div className={'container'} style={{textAlign:'center' , borderStyle:'groove',
            marginTop:'10 px'}}>
                 <GlobalNavigation username={this.props.username}/>
                <Image className="img-responsive"   src={this.props.url} width={'400'} height={'400'}/>

            </div>
        )
    }
}

export default ShowImage
