import {checkDoubleUser, loginUser} from "../../../api/user.js";

import {setAlert} from "../../utils/useInfoMessage.js";

export default class User {

    //информация об активном пользователе
    static activeUser = {};

    constructor() {
        this.getUserFromLocStore();
    }

    //получение данных из localStorage для activeUser
    getUserFromLocStore () {
        User.activeUser = JSON.parse(window.localStorage.getItem('user')) ?? {};
    }

    //изменение в localStorage информации о том "зашел ли пользователь или нет"
    setToLocalStorage () {
        let value = Object.keys(User.activeUser).length > 0;
        window.localStorage.setItem('authToken', JSON.stringify(value));
        this.setToLocalStorageUserInfo();
    }
    //изменение в localStorage данных о пользователе
    setToLocalStorageUserInfo () {
        window.localStorage.setItem('user', JSON.stringify(User.activeUser));
    }

    //выход на страницу авторизации (при неуспешном входе/неуспешном повторном входе в приложение/выходе из профиля/удаления профиля)
    async becomeToAuthorization () {
        User.activeUser = {};
        this.setToLocalStorage();

        // Заменяем текущий элемент в истории браузера
        history.replaceState(null, '', 'index.html');
        // Переходим по новой ссылке
        window.location.href = 'index.html';
    }

    //при успешном входе/регистрации
    //параметрами передаем данные о пользователе (data) и page - на какую страницу переходить (потому что не всегда надо переходить на страницу списка групп)
    successLog (data, page = 'groups.html', goTo = true) {
        User.activeUser = data
        //добавляем в localStorage данные, что пользователь зашел
        this.setToLocalStorage();

        if (goTo) {
            //переходим на страницу списка групп/журнала
            // Заменяем текущий элемент в истории браузера
            history.replaceState(null, '', page);
            // Переходим по новой ссылке
            window.location.href = page;
        }
    }

    //проверка: существует ли пользователь с таким же логином
    async checkDoubleLogin(login) {
        try {
            let data = `?login=${login}`;
            const response = await checkDoubleUser(data);
            //проверяем: существует ли такой пользователь, если существует - возвращаем false, а если нет - true
            return !response.data?.length;
        } catch (err) {
            console.log(err);
        }
    }

    //вход по логину и паролю
    //goTo - переходить на другую страницу или нет
    async logIn (login, password, page = 'groups.html', goTo = true) {
        try {
            let data = `?login=${login}&password=${password}`;

            const response = await loginUser(data);

            if (response.status === 200 && typeof response?.data === "object") {
                if (response?.data.length) {
                    await this.successLog(response.data[0], page, goTo);
                    return true;
                } else {
                    await setAlert('Пользователя с таким логином/паролем не существует!!');
                    return false;
                }
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
            await this.becomeToAuthorization();
        }
    }

    //проверка при обновлении страницы, что такой пользователь всё еще существует (задаем в page название страницы на которой находимся)
    async logInCheck (page = 'groups.html') {
        try {
            //получаем данные о прошлом зашедшем пользователе из localStorage
            this.getUserFromLocStore();

            //проверка на существование пользователя, если вернулось true, то все нормально, а если false - выходим на страницу авторизации
            let check = await this.logIn(User.activeUser.login, User.activeUser.password, page, false);
            //если такой пользователь не найден, то перезагружаем страницу
            if (!check) {
                //await setAlert('Пользователь был удален!! Страница будет перезагружена.');
                await this.becomeToAuthorization();
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }
}