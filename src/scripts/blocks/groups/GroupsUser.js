import User from "../../globals/store/useUser.js";

import GroupsList from "./GroupsList.js";

import {input} from "../../utils/useInput.js";
import {redactValidation} from "../../utils/useValidationRedact.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {setMessage} from "../../utils/useMessage.js";
import {setConfirm, setAlert} from "../../utils/useInfoMessage.js";

import FormsValidation from "../../globals/useValidation.js";

import {redactUser, removeUser} from "../../../api/user.js";

export default class GroupsUser{
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        user: '[data-js-user]',
        content: '[data-js-user-content]',
        form: '[data-js-user-form]',
        loading: '[data-js-user-loading]',

        open: '[data-js-user-open]',
        close: '[data-js-user-close]',
        redact: '[data-js-user-redact-btn]',
        exit: '[data-js-user-exit]',
        delete: '[data-js-user-delete]',

        organizationInput: '[data-js-user-organization]',
        organizationCounter: '[data-js-user-organization-counter]',

        loginInput: '[data-js-user-login]',
        loginCounter: '[data-js-user-login-counter]',

        passwordInput: '[data-js-user-password]',
        passwordCounter: '[data-js-user-password-counter]',
    }
    //==============================================================//


    //==============================================================//
    //---классы--//
    classes = {
        isActive: 'is-active'
    }
    //==============================================================//


    //==============================================================//
    //---переменные--//
    constructor() {
        this.user = new User();

        this.userElement = $(this.selectors.user);
        this.userContentElement = this.userElement.find(this.selectors.content);
        this.formElement = this.userElement.find(this.selectors.form);
        this.loadingElement = this.userElement.find(this.selectors.loading);

        this.openBtn = $(this.selectors.open);
        this.closeBtn = this.userElement.find(this.selectors.close);
        this.redactBtn = this.userElement.find(this.selectors.redact);
        this.exitBtn = this.userElement.find(this.selectors.exit);
        this.deleteBtn = this.userElement.find(this.selectors.delete);

        this.organizationInputElement = $(this.formElement).find(this.selectors.organizationInput);
        this.organizationCounterElement = $(this.formElement).find(this.selectors.organizationCounter);

        this.loginInputElement = $(this.formElement).find(this.selectors.loginInput);
        this.loginCounterElement = $(this.formElement).find(this.selectors.loginCounter);

        this.passwordInputElement = $(this.formElement).find(this.selectors.passwordInput);
        this.passwordCounterElement = $(this.formElement).find(this.selectors.passwordCounter);

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions() {
        //заполняем поля ввода информацией
        this.setUserInfo();

        //заполняем счетчики полей ввода длинной информации в полях ввода
        this.setUserCounter();

        //делаем кнопку "Редактировать" disabled
        this.redactBtn.attr('disabled', true);
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //открытие блока
        this.openBtn.on('click', this.openBlock.bind(this));

        //закрытие блока
        this.closeBtn.on('click', this.closeBlock.bind(this));

        //ввод в поля input-ы
        this.organizationInputElement.on('input', (event) => {
            input(event, this.organizationCounterElement);
            redactValidation(event, [
                User.activeUser.organization,
                User.activeUser.login,
                User.activeUser.password
            ])
        })
        this.loginInputElement.on('input', (event) => {
            input(event, this.loginCounterElement);
            redactValidation(event, [
                User.activeUser.organization,
                User.activeUser.login,
                User.activeUser.password
            ])
        })
        this.passwordInputElement.on('input', (event) => {
            input(event, this.passwordCounterElement);
            redactValidation(event, [
                User.activeUser.organization,
                User.activeUser.login,
                User.activeUser.password
            ])
        })

        //клик по кнопке "Редактировать"
        this.redactBtn.on('click', this.clickToRedact.bind(this));

        //клик по кнопке "Выйти"
        this.exitBtn.on('click', this.clickToExit.bind(this));

        //клик по кнопке "Удалить профиль"
        this.deleteBtn.on('click', this.clickToDelete.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //редактировать профиль
    redact = async () => {
        try {
            //добавляем анимацию загрузки внутри кнопки "Редактировать"
            setLoading(this.redactBtn, this.loadingElement);

            //проверяем, чтобы не существовало пользователя с таким же логином
            let check = await this.user.checkDoubleLogin(this.loginInputElement.val());

            if (check || (!check && this.loginInputElement.val() === User.activeUser.login)) {
                let data = {
                    id: User.activeUser.id,
                    login: this.loginInputElement.val(),
                    password: this.passwordInputElement.val(),
                    organization: this.organizationInputElement.val()
                }

                const response = await redactUser(data);

                if (response.status === 200) {
                    User.activeUser = data;

                    //вносим изменения о пользователе в localStorage
                    this.user.setToLocalStorage();

                    //создаем событие редактирования профиля
                    $(document).trigger('updateUser');

                    setMessage('Пользователь изменен!!');

                    //делаем кнопку неактивной (но ставим false, потому что в finally она станет true)
                    this.redactBtn.attr('disabled', false);

                    //закрываем блок редактирования пользователя
                    this.closeBlock();
                } else {
                    await setAlert('Что-то пошло не так..');
                }
            } else {
                await setAlert('Пользователь с таким логином уже существует!!');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //удаляем анимацию загрузки внутри кнопки "Редактировать"
            setLoading(this.redactBtn, this.loadingElement);
        }
    }

    //удалить профиль
    delete = async () => {
        try {
            let data = {
                params: {
                    id: User.activeUser.id
                }
            }

            const response = await removeUser(data);

            if (response.status === 200) {
                setMessage('Пользователь удален!!');

                setTimeout(() => {
                    this.user.becomeToAuthorization();
                }, 1000)
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //заполняем поля ввода информацией о пользователе
    setUserInfo () {
        this.organizationInputElement.val(User.activeUser.organization);
        this.loginInputElement.val(User.activeUser.login);
        this.passwordInputElement.val(User.activeUser.password);
    }

    //заполняем counter-ы нужными числами
    setUserCounter () {
        this.organizationCounterElement.text(this.organizationInputElement.val().length);
        this.loginCounterElement.text(this.loginInputElement.val().length);
        this.passwordCounterElement.text(this.passwordInputElement.val().length);
    }

    //открытие блока редактирования пользователя
    openBlock () {
        this.userElement.addClass(this.classes.isActive);

        this.userContentElement.animate({
            top: '50%'
        }, 250)
    }

    //закрытие блока редактирования пользователя
    closeBlock () {
        this.userContentElement.animate({
            top: '-100%'
        }, 200, () => {
            this.userElement.removeClass(this.classes.isActive);
        })
    }

    //клик по кнопке "Редактировать"
    clickToRedact = async () => {
        let check = new FormsValidation().onSubmit(this.formElement);

        if (check) {
            const confirmed = await setConfirm('Вы действительно хотите редактировать профиль?');

            if (confirmed) {
                this.redact();
            }
        }
    }

    //клик по кнопке "Выйти"
    clickToExit = async () => {
        let confirmed = await setConfirm('Вы действительно хотите выйти?');

        if (confirmed) {
            this.user.becomeToAuthorization();
        }
    }

    //клик по кнопке "Удалить профиль"
    clickToDelete = async () => {
        let confirmed = await setConfirm('Вы действительно хотите удалить профиль?');

        if (confirmed) {
            this.delete();
        }
    }
    //==============================================================//
}