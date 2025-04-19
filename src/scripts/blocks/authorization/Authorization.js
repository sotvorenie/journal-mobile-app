import Swiper from "swiper";
import {EffectFlip} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/effect-flip';

import FormsValidation from "../../globals/useValidation.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {setMessage} from "../../utils/useMessage.js";
import {setAlert} from "../../utils/useInfoMessage.js";

import {registrationUser} from "../../../api/user.js";

import User from "../../globals/store/useUser.js";

//==============================================================//

export default class Authorization extends User{
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        //основной блок авторизации
        authorization: '[data-js-authorization]',

        //элементы form
        form: '[data-js-authorization-form]',
        //элементы input
        input: '[data-js-authorization-input]',
        //элементы span-ошибок валидации
        error: '[data-js-form-field-errors]',
        //кнопка "Войти"
        logIn: '[data-js-authorization-login]',
        //кнопка "Зарегистрироваться"
        registration: '[data-js-authorization-registration]',

        //кнопка "Перейти к регистрации"
        toRegistration: '[data-js-authorization-to-registration]',

        //слайдер и слайды
        swiper: '[data-js-authorization-swiper]',
        slide: '[data-js-authorization-slide]'
    }
    //==============================================================//


    //==============================================================//
    //---классы--//
    classes = {
        isActive: 'is-active',
        loading: 'loading'
    }
    //==============================================================//


    //==============================================================//
    //---переменные--//
    constructor() {
        super();

        this.authorizationElement = $(this.selectors.authorization);

        this.formElements = this.authorizationElement.find(this.selectors.form);
        this.inputElements = this.authorizationElement.find(this.selectors.input);
        this.loginErrorElements = $(this.formElements[0]).find(this.selectors.error);
        this.loginInputElements = $(this.formElements[0]).find(this.selectors.input);
        this.registrationInputElements = $(this.formElements[1]).find(this.selectors.input);
        this.logInBtn = this.authorizationElement.find(this.selectors.logIn);
        this.regBtn = this.authorizationElement.find(this.selectors.registration);
        this.toRegBtn = this.authorizationElement.find(this.selectors.toRegistration);

        //блок загрузки внутри кнопки "Войти"
        this.loginBtnLoadingElement = this.logInBtn.find(`.${this.classes.loading}`);
        //блок загрузки внутри кнопки "Зарегистрироваться"
        this.regBtnLoadingElement = this.regBtn.find(`.${this.classes.loading}`);

        //инициализация слайдера
        this.swiperElement = new Swiper(this.selectors.swiper, {
            modules: [EffectFlip],
            effect: 'flip',
            allowTouchMove: false,
        });

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions() {
        //очищаем все поля ввода
        this.clearInputs();

        //если в localStorage есть логин и пароль - заходим по ним
        let login = JSON.parse(window.localStorage.getItem('user'))?.login ?? '';
        let password = JSON.parse(window.localStorage.getItem('user'))?.password ?? '';

        if (login.length && password.length) {
            new User().logIn(login, password);
        }
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке "Перейти к регистрации"
        this.toRegBtn.on('click', () => {
            this.clickToGoRegistration()
            this.clearLogIn()
        })

        //клик по кнопке "Войти"
        this.logInBtn.on('click', () => {
            //проверяем что все поля заполнены и корректны
            let check = new FormsValidation().onSubmit(this.formElements[0]);

            if (check) {
                //вызываем функцию входа по логину и паролю
                this.login();
            }
        })

        //клик по кнопке "Зарегистрироваться"
        this.regBtn.on('click', () => {
            //проверяем что все поля заполнены и корректны
            let check = new FormsValidation().onSubmit(this.formElements[1]);

            if (check) {
                //вызываем функцию входа по логину и паролю
                this.registration();
            }
        })
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //вход по логину и паролю
    login = async () => {
        //добавляем анимацию загрузки внутри кнопки "Войти"
        setLoading(this.logInBtn, this.loginBtnLoadingElement);

        //получаем логин и пароль
        let login = this.loginInputElements[0].value;
        let password = this.loginInputElements[1].value;

        await this.logIn(login, password);

        //убираем анимацию загрузки внутри кнопки "Войти"
        setLoading(this.logInBtn, this.loginBtnLoadingElement);
    }

    //регистрация нового пользователя
    registration = async () => {
        try {
            //добавляем анимацию загрузки внутри кнопки "Зарегистрироваться"
            setLoading(this.regBtn, this.regBtnLoadingElement);

            //проверяем, чтобы не было пользователя с таким же логином
            let check = await this.checkDoubleLogin(this.registrationInputElements[0].value);

            if (check) {
                let data = {
                    login: this.registrationInputElements[0].value,
                    password: this.registrationInputElements[1].value,
                    organization: this.registrationInputElements[2].value
                }

                const response = await registrationUser(data);

                if (response.status === 200) {
                    setMessage('Регистрация прошла успешно!!');

                    //переходим на страницу списка групп
                    setTimeout(() => {
                        this.successLog(data);
                    }, 2000);
                } else {
                    await setAlert('Что-то пошло не так..')
                }
            } else {
                await setAlert('Пользователь с таким логином уже существует!!');
                //убираем анимацию загрузки внутри кнопки "Зарегистрироваться"
                setLoading(this.regBtn, this.regBtnLoadingElement)
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..')
            //убираем анимацию загрузки внутри кнопки "Зарегистрироваться"
            setLoading(this.regBtn, this.regBtnLoadingElement)
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //переходим к элементу регистрации
    clickToGoRegistration = () => {
        this.swiperElement.slideTo(1);
    }

    //очистка блока входа
    clearLogIn = () => {
        //убираем все сообщения об ошибках
        this.loginErrorElements.each((index, error) => {
            $(error).remove();
        })

        //очищаем поля ввода
        this.clearInputs();
    }

    //очистка всех input
    clearInputs = () => {
        this.inputElements.each((index, input) => {
            $(input).val('');
        })
    }
    //==============================================================//
}