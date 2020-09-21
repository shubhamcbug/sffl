/**
 * Created by Sundar on 07-09-2020.
 * email tksrajan@gmail.com
 */
import React from "react";

const UploadSpinner = (props) =>{
    return(
        <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default UploadSpinner