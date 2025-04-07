import {setAlert} from "../../utils/useInfoMessage.js";

import {getDaysList} from "../../../api/days.js";

import User from "./useUser.js";
import Groups from "./useGroups.js";

export default class Days {
    //выбранный день
    static activeDay = {};

    //список дней
    static daysList = [];

    //получение даты/списка дат
    getDate = async (offset, limit, dateInfo = []) => {
        try {
            let data;

            data = `?user_id=${User.activeUser.id}
                            &group_id=${Groups.activeGroup.id}
                            &offset=${offset}&limit=${limit}`;

            //если передали дополнительные параметры (день/месяц/год)
            if (dateInfo.length > 0) {
                if (dateInfo[0].length) {
                    data = data + `&day=${dateInfo[0]}`;
                }
                if (dateInfo[1].length) {
                    data = data + `&month=${dateInfo[1]}`;
                }
                if (dateInfo[2].length) {
                    data = data + `&year=${dateInfo[2]}`;
                }
            }

            const response = await getDaysList(data);

            if (response.status === 200) {
                return response.data;
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

}