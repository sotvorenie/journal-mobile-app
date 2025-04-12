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

    //удаляем пробелы
    deleteUnnecessary (date) {
        return date.map(str => str.replace(/\D/g, ''));
    }

    //приводим дату к нужному виду (удаляем строки и пробелы, а также добавляем нули если нужно)
    correctDate (date) {
        //удаляем пробелы
        date = date.map(i => i.replace(/\s+/g, ''));

        //удаляем буквы
        date = date.map(i => i.replace(/\D/g, ''));

        //заполняем пробелы в дне
        if (date[0].length === 1) {
            date[0] = `0${date[0]}`;
        }

        //заполняем пробелы в месяце
        if (date[1].length === 1) {
            date[1] = `0${date[1]}`;
        }

        //заполняем пробелы в годе
        if (date[2].length === 1) {
            date[2] = `200${date[2]}`;
        } else if (date[2].length === 2) {
            date[2] = `20${date[2]}`;
        } else if (date[2].length === 3) {
            date[2] = `2${date[2]}`;
        }

        return date;
    }

    //проверка на правильность введенных данных
    checkCorrectDate = async (day, month, year) => {
        //проверка на правильность введенного дня
        if (day && (+day > 31 || +day < 0)) {
            await setAlert('Некорректно введен день!! Пожалуйста, проверьте поле ввода дня');
            return false;
        }

        //проверка на правильность введенного месяца
        if (month && (+month < 0 || +month > 12)) {
            await setAlert('Некорректно введен месяц!! Пожалуйста, проверьте поле ввода месяца');
            return false;
        }

        //проверка на правильность введенного года
        if (year && +year < 2000) {
            await setAlert('Некорректно введен год!! Пожалуйста, проверьте поле ввода года');
            return false;
        }

        return true;
    }

}