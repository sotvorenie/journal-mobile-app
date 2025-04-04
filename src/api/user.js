import axios from "axios";
import {url} from "./index.js";

export async function loginUser (data) {
    return axios.get(`${url}/users/getUser.php${data}`);
}

export function checkDoubleUser (data) {
    return axios.get(`${url}/users/getUserForRegistration.php${data}`);
}

export function registrationUser (data) {
    return axios.post(`${url}/users/createUser.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function redactUser (data) {
    return axios.patch(`${url}/users/updateUser.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function removeUser (data) {
    return axios.delete(`${url}/users/deleteUser.php`, data);
}