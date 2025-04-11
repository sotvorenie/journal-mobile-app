import Days from "../../globals/store/useDays.js";

import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";
import {setAlert} from "../../utils/useInfoMessage.js";

export default class JournalDate {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-date]',
        open: '[data-js-date-open]',
        close: '[data-js-date-close]',
        searchInput: '[data-js-date-search-input]',
        searchBtn: '[data-js-date-search]',
        noData: '[data-js-date-no-data]',
        loading: '[data-js-date-loading]',
        nullList: '[data-js-date-null-list]',
        list: '[data-js-date-list]',
        item: '[data-js-date-item]',
        itemName: '[data-js-date-item-name]',
        itemInfoBtn: '[data-js-date-item-info]'
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
        this.days = new Days();

        this.dateElement = $(this.selectors.root);

        this.openBtn = $(this.selectors.open);
        this.closeBtn = this.dateElement.find(this.selectors.close);
        this.searchInputElements = this.dateElement.find(this.selectors.searchInput);
        this.searchBtn = this.dateElement.find(this.selectors.searchBtn);
        this.noDataElement = this.dateElement.find(this.selectors.noData);
        this.loadingElement = this.dateElement.find(this.selectors.loading);
        this.nullListElement = this.dateElement.find(this.selectors.nullList);
        this.listElement = this.dateElement.find(this.selectors.list);

        //количество оставшихся на сервере дней
        this.remainingNumber = 0;

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //очищаем поля ввода поиска дней
        this.clearSearchInputs();

        //получаем первые 20 дней и встраиваем список дней на страницу
        this.getDays();

        //событие, когда встроили список дней на страницу
        $(document).on('createDaysList', () => {
            //получаем кнопки info каждого элемента списка дней
            this.itemInfoBtns = this.dateElement.find(this.selectors.itemInfoBtn);
        })
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //открытие блока
        this.openBtn.on('click', () => {
            openBlock(this.dateElement, this.openBtn[0]);
        })

        //закрытие блока
        this.closeBtn.on('click', () => {
            closeBlock(this.dateElement);
        })
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //получаем список дней
    getDays = async () => {
        try {
            //показываем анимацию загрузки
            this.loadingElement.addClass(this.classes.isActive);

            let days = await this.days.getDate(0, 20);

            if (days) {
                //скрываем, что список дней пуст
                this.nullListElement.removeClass(this.classes.isActive);
                //скрываем блок noData
                this.noDataElement.removeClass(this.classes.isActive);

                //задаем в переменную, отвечающую за список дней - список дней, а также заполняем переменную количества оставшихся на сервере дней
                this.checkNumberDaysList(days);

                //создаем список дней
                this.createDaysList(days.data);
            } else {
                //показываем, что список дней пуст
                this.noDataElement.addClass(this.classes.isActive);
                //показываем блок noData
                this.noDataElement.addClass(this.classes.isActive);
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //скрываем анимацию загрузки
            this.loadingElement.removeClass(this.classes.isActive);
        }
    }

    //удаление дня
    deleteDay = async (dateInfo) => {
        try {

        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {

        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //очистка полей ввода поиска дней
    clearSearchInputs () {
        this.searchInputElements.each((index, element) => $(element).val(''));
    }

    //задаем значение в переменную, отвечающую за список дней и количество оставшихся дней на сервере
    checkNumberDaysList (days) {
        if (days.data.length) {
            Days.daysList = days.data;
            this.remainingNumber = days.remaining;
        } else {
            Days.daysList = [];
            this.remainingNumber = 0;
        }
    }

    //преобразуем числовое значение месяца в строковое название месяца
    setMonthName (month) {
        return [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ][+month - 1];
    }

    //создаем список дней и встраиваем его на страницу
    createDaysList (days) {
        //создаем элемент списка дней
        let dayItems = days.map(day => {
            return `
                <li class="date__item list__item" data-js-date-item>
                  <p class="h5" data-js-date-item-name>${day.day} ${this.setMonthName(day.month)} ${day.year}</p>
    
                  <button class="date__list-btn" type="button" data-js-date-item-info>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title/><g data-name="Layer 2" id="Layer_2"><path d="M16,12a2,2,0,1,1,2-2A2,2,0,0,1,16,12Zm0-2Z"/><path d="M16,29A13,13,0,1,1,29,16,13,13,0,0,1,16,29ZM16,5A11,11,0,1,0,27,16,11,11,0,0,0,16,5Z"/><path d="M16,24a2,2,0,0,1-2-2V16a2,2,0,0,1,4,0v6A2,2,0,0,1,16,24Zm0-8v0Z"/></g><g id="frame"><rect class="cls-1" height="32" width="32"/></g></svg>
                  </button>
                </li>
            `
        }).join('');

        //встраиваем элементы списка в ul
        this.listElement.append(dayItems);

        //создаем событие, когда встроили список дней на страницу
        $(document).trigger('createDaysList');
    }
    //==============================================================//
}