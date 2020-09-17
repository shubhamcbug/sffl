import React from 'react';
import axios from 'axios'

export const getRemoteApiData =  (url, formData) => {
    console.log("getting api data from with form data", url, formData)
    let httpRequest = new XMLHttpRequest();
    const method = formData === null? 'GET':'POST'
    httpRequest.open(method, url, false);
    let data = null;
    httpRequest.onload = (() => {
        data = JSON.parse(httpRequest.response);
        console.log('data received by util ', data)
        return data;
    });

    httpRequest.onerror = (() => {
        console.log('error receiving data', httpRequest.status)
        return null
    });
    httpRequest.send(formData);
    return data;
    // const response =  await axios.post(url,formData)
    // console.log('data received by util ',response.data)
    // return response.data;

}



export default getRemoteApiData





