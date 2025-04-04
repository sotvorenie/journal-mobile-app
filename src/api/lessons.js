import axios from "axios";
import {url} from "./index.js";

export function getLessons (data) {
    return axios.get(`${url}/lessons/getLessons.php${data}`);
}

export function checkLesson (data) {
    return axios.get(`${url}/lessons/checkLesson.php${data}`);
}

export function createNewLesson (data) {
    return axios.post(`${url}/lessons/createLesson.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function removeLesson (data) {
    return axios.delete(`${url}/lessons/deleteLesson.php`, data);
}

export function redactLessons (data) {
    return axios.patch(`${url}/lessons/updateLesson.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}