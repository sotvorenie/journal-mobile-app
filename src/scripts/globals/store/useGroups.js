import User from "./useUser.js";

import {checkStudentGroup} from "../../../api/groups.js";

export default class Groups extends User{
    constructor() {
        super();

        //активная группа
        this.activeGroup = {};
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