import User from "./useUser.js";

import {checkStudentGroup} from "../../../api/groups.js";

export default class Groups{
    //активная группа
    static activeGroup = {};

    //получение данных об активной группе из localStorage
    getFromLocStore () {
        Groups.activeGroup = JSON.parse(window.localStorage.getItem('activeGroup') ?? '{}');
    }

    //проверка существования группы (чтобы если ее удалили, то мы выводили ошибку и перезагружали страницу
    checkGroup = async (id = '', name = '') => {
        try {
            let data = `?user_id=${User.activeUser.id}&id=${id}&name=${name}`;

            const response = await checkStudentGroup(data);

            if (response.status === 200) {
                return !response.data.length;
            } else {
                alert('Что-то пошло не так..');
            }
        } catch (err) {
            alert('Что-то пошло не так..');
        }
    }
}