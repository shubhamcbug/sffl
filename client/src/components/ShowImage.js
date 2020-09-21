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
            <div >
                 <GlobalNavigation username={this.props.username}/>
                <Image className="img-responsive"   src={this.props.url} />

            </div>
        )
    }
}

export default ShowImage
