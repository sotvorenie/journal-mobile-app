import {setAlert} from "../../utils/useInfoMessage.js";

import {getStudentsList, checkStudent} from "../../../api/students.js";

import User from "./useUser.js";
import Groups from "./useGroups.js";

export default class Students {
    //список студентов группы
    static students = [];

    //активный студент, на которого кликнули
    static activeStudent = {};

    //получение списка студентов
    getStudents = async () => {
        try {
            let data = `?user_id=${User.activeUser.id}&group_id=${Groups.activeGroup.id}`;

            const response = await getStudentsList(data);

            if (response.status === 200) {
                Students.students = response.data;
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //проверка существования студента (если вдруг его удалили)
    checkAStudent = async (id = '', name = '', second_name = '', surname = '') => {
        try {
            let data = `?user_id=${User.activeUser.id}&group_id=${Groups.activeGroup.id}
                                    &id=${id}&name=${name}&second_name=${second_name}&surname=${surname}`;

            const response = await checkStudent(data);

            if (response.status === 200) {
                return response.data.length === 0;
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }
}