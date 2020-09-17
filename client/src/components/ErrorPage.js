import React from "react";
import GlobalNavigation from "./GlobalNavigation";

export const ErrorPage = (props) =>{

    return(

        <>
            <div className={'card'}>
                <div className="card-title">
                    <GlobalNavigation username={props.username}/>
                </div>
                <div className={'card-body'}>
                    Oops {props.username} something went wrong, please try again later
                </div>
            </div>
        </>
    )
}


export default ErrorPage