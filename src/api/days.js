import axios from "axios";
import {url} from "./index.js";

export function getDaysList (data) {
    return axios.get(`${url}/days/getDays.php${data}`);
}

export function createNewDay (data) {
    return axios.post(`${url}/days/createDay.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function removeDay (data) {
    return axios.delete(`${url}/days/deleteDay.php`, data)
}

export function updateDay (data) {
    return axios.patch(`${url}/days/updateDay.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}