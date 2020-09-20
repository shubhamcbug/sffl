/**
 * Created by Sundar on 07-09-2020.
 * email tksrajan@gmail.com
 */

import React, {Component} from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import Image from "react-bootstrap/Image";

class ShowImage extends Component{
    constructor(props) {
        super(props);

    }

    render() {

        return(
            <div className={'card'}>

                <Image src={this.props.url} />

            </div>
        )
    }
}

export default ShowImage
