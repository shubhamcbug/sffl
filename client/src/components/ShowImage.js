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
            <div style={{
                textAlign: 'center'
            }}>
                  <div>
                    <GlobalNavigation username={this.props.username}/>
                    </div>
                <p/>
                <div  style={{
                    height: '60%' ,width: '60%',margin: 'auto', display:'block'
                }}>
                    <img className="img-responsive"
                           src={this.props.url} style={{
                               width: '300',
                        height:'300',
                        borderStyle: 'solid'
                    }}
                           />
                </div>

            </div>
        )
    }
}

export default ShowImage
