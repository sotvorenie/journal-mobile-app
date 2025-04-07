import {setAlert} from "../../utils/useInfoMessage.js";

import Days from "./useDays.js";
import User from "./useUser.js";
import Groups from "./useGroups.js";

import {getClassesList} from "../../../api/classes.js";

export default class Classes {
    //активный classes
    static activeClasses = [];

    //получаем classes за последний день
    getClasses = async () => {
        try {
            if (Days.activeDay.date_info.length) {
                let data = `?user_id=${User.activeUser.id}
                                    group_id=${Groups.activeGroup.id}
                                    &date_info=${Days.activeDay.date_info}`;

                const response = await getClassesList(data);

                if (response.status === 200) {
                    Classes.activeClasses = response.data;
                } else {
                    await setAlert('Что-то пошло не так..');
                }
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }
}