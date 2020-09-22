import React from 'react';
import axios from 'axios'

export const getRemoteApiData = async (url, formData) => {
    console.log("getting api data from with form data", url, formData)
    const method = (formData === null||formData===undefined)? 'GET':'POST'
    let response=null;
    if (method === 'GET')
        response =  await axios.get(url);
    else
        response = await axios.post(url, formData);
    const data = await response.data;
    console.log('data received by util ',data);
    return data;

}

export const syncData = (url, formData)=>{
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
}









