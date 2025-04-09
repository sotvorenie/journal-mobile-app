import UseGroups from "./useGroups.js";

import {input} from "../../utils/useInput.js";
import {redactValidation} from "../../utils/useValidationRedact.js";
import {setMessage} from "../../utils/useMessage.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";
import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";

import {redactStudentsGroup} from "../../../api/groups.js";

import User from "../../globals/store/useUser.js";

export default class GroupsRedact {
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-groups-redact]',
        open: '[data-js-groups-redact-open]',
        close: '[data-js-groups-redact-close]',
        input: '[data-js-groups-redact-input]',
        counter: '[data-js-groups-redact-counter]',
        redact: '[data-js-groups-redact-btn]',
        loading: '[data-js-groups-redact-loading]'
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
        this.useGroups = new UseGroups();

        this.redactElement = $(this.selectors.root);

        this.closeBtn = this.redactElement.find(this.selectors.close);
        this.inputElement = this.redactElement.find(this.selectors.input);
        this.counterElement = this.redactElement.find(this.selectors.counter);
        this.redactBtn = this.redactElement.find(this.selectors.redact);
        this.loadingElement = this.redactElement.find(this.selectors.loading);

        //переменная координат кнопки открытия блока
        this.coordinates = {};

        //получаем кнопки "Редактировать группу" когда элементы группы добавлены на страницу
        $(document).on('groupsListRendered', () => {
            //кнопки открытия блока редактирования группы
            this.openBtns = $(this.selectors.open);

            //клик по кнопке открытия блока редактирования группы
            this.openBtns.each((index, btn) => {
                $(btn).on('click', (event) => {
                    //заполняем блок информацией о редактируемой группе
                    this.setInfo(index);

                    //открываем блок редактирования группы
                    openBlock(this.redactElement, btn);

                    //создаем событие, когда открываем блок редактирования группы
                    $(document).trigger('groupsRedactOpen');

                    event.stopPropagation();
                })
            })
        })

        this.bindEvents();

        this.loadFunctions();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {

    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке закрытия блока
        this.closeBtn.on('click', this.closeBlock.bind(this));

        //ввод в input
        this.inputElement.on('input', (event) => {
            input(event, this.counterElement);

            redactValidation(event, [UseGroups.activeGroup.name]);
        })

        //клик по кнопке "Редактировать"
        this.redactBtn.on('click', this.clickToRedact.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //редактировать группу
    redact = async () => {
        try {
            //показываем анимацию загрузки внутри кнопки "Редактировать"
            setLoading(this.redactBtn, this.loadingElement);

            //проверяем, чтобы не было дублирования имени группы
            let check = this.useGroups.checkDoubleName(this.inputElement.val());

            if (check) {
                let data = {
                    user_id: User.activeUser.id,
                    id: UseGroups.activeGroup.id,
                    name: this.inputElement.val()
                }

                const response = await redactStudentsGroup(data);

                if (response.status === 200) {
                    //выводим сообщение
                    setMessage('Группа изменена!!');

                    //закрываем блок
                    this.closeBlock();

                    //делаем кнопку "Редактировать" disabled
                    this.redactBtn.attr('disabled', false);

                    //обновляем список групп
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
            //скрываем анимацию загрузки внутри кнопки "Редактировать"
            setLoading(this.redactBtn, this.loadingElement);
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //добавление информации о редактируемой группе
    setInfo (id) {
        UseGroups.activeGroup = UseGroups.groupsList[id];

        let name = UseGroups.activeGroup.name;

        //вводим в input название группы
        this.inputElement.val(name);

        //вводим в счетчик количество символов в поле ввода
        this.counterElement.text(name.length);
    }

    //закрытие блока
    closeBlock = async () => {
        await closeBlock(this.redactElement);

        //делаем кнопку "Редактировать" disabled
        this.redactBtn.attr('disabled', true);
    }

    //клик по кнопке "Редактировать"
    clickToRedact = async () => {
        let confirmed = await setConfirm('Вы действительно хотите редактировать группу?');

        if (confirmed) {
            this.redact();
        }
    }
    //==============================================================//
}