import axios from "axios";
import {url} from "./index.js";

export function getClassesList (data) {
    return axios.get(`${url}/classes/getClasses.php${data}`);
}

export function createNewClasses (data) {
    return axios.post(`${url}/classes/createClasses.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function removeClasses (data) {
    return axios.delete(`${url}/classes/deleteClasses.php`, data);
}

export function updateClasses (data) {
    return axios.patch(`${url}/classes/updateClasses.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function updateClassesInfo (data) {
    return axios.patch(`${url}/classes/updateClassesInfo.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}