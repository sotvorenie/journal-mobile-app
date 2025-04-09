import {input} from "../../utils/useInput.js";
import {redactValidation} from "../../utils/useValidationRedact.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {setMessage} from "../../utils/useMessage.js";
import {setConfirm, setAlert} from "../../utils/useInfoMessage.js";
import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";

import {createStudentsGroup} from "../../../api/groups.js";

import Groups from "../../globals/store/useGroups.js";
import UseGroups from "./useGroups.js";
import User from "../../globals/store/useUser.js";

export default class GroupsCreate{
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-create-group]',

        open: '[data-js-create-group-open]',
        close: '[data-js-create-group-close]',
        input: '[data-js-create-group-input]',
        counter: '[data-js-create-group-counter]',
        create: '[data-js-create-group-create]',
        loading: '[data-js-create-group-loading]'
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
        this.groups = new Groups();
        this.useGroups = new UseGroups();
        this.user = new User();

        this.createGroupElement = $(this.selectors.root);

        this.openBtn = $(this.selectors.open);
        this.closeBtn = this.createGroupElement.find(this.selectors.close);
        this.inputElement = this.createGroupElement.find(this.selectors.input);
        this.counterElement = this.createGroupElement.find(this.selectors.counter);
        this.createBtn = this.createGroupElement.find(this.selectors.create);
        this.loadingElement = this.createGroupElement.find(this.selectors.loading);

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions() {
        this.clearInfo();
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке открытия блока
        this.openBtn.on('click', () => {
            openBlock(this.createGroupElement, this.openBtn[0])
        });

        //клик по кнопке закрытия блока
        this.closeBtn.on('click', this.closeBlock.bind(this));

        //ввод в input
        this.inputElement.on('input', (event) => {
            input(event, this.counterElement);

            redactValidation(event, ['']);
        })

        //клик по кнопке "Создать"
        this.createBtn.on('click', this.clickToCreate.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //создание группы
    create = async () => {
        try {
            //показываем анимацию загрузки внутри кнопки "Создать"
            setLoading(this.createBtn, this.loadingElement);

            //проверяем, чтобы не было группы с таким же названием
            let check = this.useGroups.checkDoubleName(this.inputElement.val());

            //проверяем, чтобы такой группы уже не существовало на сервере
            let check2 = await this.groups.checkGroup('', this.inputElement.val());

            if (check && check2) {
                let data = {
                    user_id: User.activeUser.id,
                    name: this.inputElement.val()
                }

                const response = await createStudentsGroup(data);


                if (response.status === 200) {
                    //показываем сообщение, что группа добавлена
                    setMessage('Группа добавлена!!');

                    this.closeBlock();

                    //делаем кнопку "Добавить" disabled
                    this.createBtn.attr('disabled', false);

                    //получаем список групп пользователя
                    await this.useGroups.getGroups();
                } else {
                    await setAlert('Что-то пошло не так..');
                }
            } else {
                await setAlert('Такая группа уже существует!!');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //показываем анимацию загрузки внутри кнопки "Создать"
            setLoading(this.createBtn, this.loadingElement);
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //очистка поля ввода и счетчика
    clearInfo () {
        //очищаем поле ввода
        this.inputElement.val('');

        //значение counter ставим равное 0
        this.counterElement.text(0);

        //делаем кнопку "Создать" disabled
        this.createBtn.attr('disabled', true);
    }

    //закрытие блока
    closeBlock = async () => {
        await closeBlock(this.createGroupElement);

        this.clearInfo();
    }

    //клик по кнопке "Создать"
    clickToCreate = async () => {
        let confirmed = await setConfirm('Вы действительно хотите создать группу');

        if (confirmed) {
            this.create();
        }
    }
    //==============================================================//
}