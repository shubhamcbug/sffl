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
            <div className={'card'} style={{
                textAlign: 'center'
            }}>
                  <div>
                    <GlobalNavigation username={this.props.username}/>
                    </div>

                <div className={'card-img' }>
                    <Image className="img-responsive"
                           src={this.props.url}
                           width={'300'}
                           height={'300'}
                           borderStyle={'inset'}/>
                </div>
            </div>
        )
    }
}

export default ShowImage
