import axios from "axios";
import {url} from "./index.js";

export function getStudentsGroups (data) {
    return axios.get(`${url}/student_group/getStudentsGroups.php${data}`);
}

export function checkStudentGroup (data) {
    return axios.get(`${url}/student_group/checkStudentGroup.php${data}`);
}

export function createStudentsGroup (data) {
    return axios.post(`${url}/student_group/createStudentGroup.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function deleteStudentsGroup (data) {
    return axios.delete(`${url}/student_group/deleteStudentGroup.php`, data);
}

export function redactStudentsGroup (data) {
    return axios.patch(`${url}/student_group/updateStudentGroup.php`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}