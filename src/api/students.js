import axios from "axios";
import {url} from "./index.js";

export function getStudentsList (data) {
    return axios.get(`${url}/students/getStudents.php${data}`);
}

export function checkStudent (data) {
    return axios.get(`${url}/students/checkStudent.php${data}`);
}

export function getStudentPasses (data) {
    return axios.get(`${url}/students/getStudentPasses.php${data}`);
}

export function createNewStudent (data) {
    return axios.post(`${url}/students/createStudent.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function removeStudent (data) {
    return axios.delete(`${url}/students/deleteStudent.php`, data);
}

export function updateStudent (data) {
    return axios.patch(`${url}/students/updateStudent.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}