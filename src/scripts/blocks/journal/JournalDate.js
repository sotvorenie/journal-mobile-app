import Days from "../../globals/store/useDays.js";

import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";
import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";
import User from "../../globals/store/useUser.js";
import Groups from "../../globals/store/useGroups.js";
import {setMessage} from "../../utils/useMessage.js";

import {removeDay} from "../../../api/days.js";
import {removeClasses} from "../../../api/classes.js";
import Classes from "../../globals/store/useClasses.js";

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
        itemInfoBtn: '[data-js-date-item-info]',
        itemBtnBar: '[data-js-date-item-btn-bar]',
        itemDelete: '[data-js-date-item-delete]',
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

        //переменная, показывающая: открывали ли мы этот блок ранее или нет
        //это нужно, чтобы если мы открывали блок впервые, то загружали данные дней, а если повторно, то загрузки дней уже не было
        this.openBlockCounter = false;

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //очищаем поля ввода поиска дней
        this.clearSearchInputs();

        //событие, когда встроили список дней на страницу, а также когда удалили день
        $(document).on('createDaysList deleteDay', () => {//получаем элементы списка дней
            this.itemElements = this.dateElement.find(this.selectors.item);
            //получаем кнопки info каждого элемента списка дней
            this.itemInfoBtns = this.dateElement.find(this.selectors.itemInfoBtn);
            //получаем btn-bar каждого элемента списка дней
            this.itemBtnBarElements = this.dateElement.find(this.selectors.itemBtnBar);
            //получаем кнопки delete каждого элемента списка дней
            this.itemDeleteBtn = this.dateElement.find(this.selectors.itemDelete);

            //удаляем старые обработчики событий
            this.itemElements.off('click');
            this.itemInfoBtns.off('click')
            this.itemDeleteBtn.off('click');

            //при клике по элементу списка дней
            this.itemElements.each((index, element) => {
                $(element).on('click', () => {
                    this.clickToDay(Days.daysList[index], index);
                })
            })

            //при клике по кнопке i для открытия btn-bar
            this.itemInfoBtns.each((index, btn) => {
                $(btn).on('click', (event) => {
                    $(this.itemBtnBarElements[index]).addClass(this.classes.isActive);

                    event.stopPropagation();
                })
            })

            //при клике по кнопке удаления дня
            this.itemDeleteBtn.each((index, btn) => {
                $(btn).on('click', (event) => {
                    this.clickToDelete(Days.daysList[index].date_info);

                    event.stopPropagation();
                })
            })
        })

        //событие, когда создали новый день, чтобы выбрать его как активный
        $(document).on('createDay', () => {
            //создаем список дней
            this.createDaysList(Days.daysList);

            //выбираем только что созданный день как активный
            this.clickToDay(Days.daysList[0], 0);
        })

        //событие, когда мы редактируем день
        $(document).on('redactDay', (event, index) => {
            //создаем список дней
            this.createDaysList(Days.daysList);

            //если index > 0 - выбираем день
            if (index > 0) {
                //выбираем только что созданный день как активный
                this.clickToDay(Days.daysList[index], index);
            }
        })
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //открытие блока
        this.openBtn.on('click', () => {
            openBlock(this.dateElement, this.openBtn[0]);

            if (!this.openBlockCounter) {
                //получаем первые 20 дней и встраиваем список дней на страницу
                this.getDays();

                //вносим в переменную данные, что блок дат уже открывался
                this.openBlockCounter = true;
            }
        })

        //закрытие блока
        this.closeBtn.on('click', () => {
            closeBlock(this.dateElement);

            //закрываем все btn-bars в элементах списка дней
            this.closeAllBtnBars();
        })

        //клик по кнопке поиска даты
        this.searchBtn.on('click', (event) => {
            this.clickToFindDate();

            event.preventDefault();
        })

        //при листании списка дней
        this.listElement.on('scroll', this.debounce(this.scrollDays.bind(this), 500).bind(this))
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //получаем список дней
    getDays = async (dateInfo = []) => {
        try {
            //показываем анимацию загрузки
            this.loadingElement.addClass(this.classes.isActive);

            let days = await this.days.getDate(0, 20, dateInfo);

            if (days.data.length) {
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
                this.nullListElement.addClass(this.classes.isActive);
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
            let data = {
                params: {
                    user_id: User.activeUser.id,
                    group_id: Groups.activeGroup.id,
                    date_info: dateInfo
                }
            }

            const response = await removeDay(data);

            if (response.status === 200) {
                //удаляем ячейки журнала
                await this.deleteClasses(dateInfo);
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {

        }
    }

    //удаление ячеек журнала
    deleteClasses = async (dateInfo) => {
        try {
            let data = {
                params: {
                    user_id: User.activeUser.id,
                    group_id: Groups.activeGroup.id,
                    date_info: dateInfo
                }
            }

            const response = await removeClasses(data);

            if (response.status === 200) {
                await this.setNewDay(dateInfo);

                //создаем событие удаления дня
                $(document).trigger('deleteDay');

                setMessage('День удален!!');
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
            let activeClass = 'date__item list__item';
            if (Days.activeDay.date_info === day.date_info) {
                activeClass = 'date__item list__item is-active';
            }

            return `
                <li class="${activeClass}" data-js-date-item>
                  <p class="h5" data-js-date-item-name>${day.day} ${this.setMonthName(day.month)} ${day.year}</p>
    
                  <button class="date__list-info date__list-btn" type="button" data-js-date-item-info>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title/><g data-name="Layer 2" id="Layer_2"><path d="M16,12a2,2,0,1,1,2-2A2,2,0,0,1,16,12Zm0-2Z"/><path d="M16,29A13,13,0,1,1,29,16,13,13,0,0,1,16,29ZM16,5A11,11,0,1,0,27,16,11,11,0,0,0,16,5Z"/><path d="M16,24a2,2,0,0,1-2-2V16a2,2,0,0,1,4,0v6A2,2,0,0,1,16,24Zm0-8v0Z"/></g><g id="frame"><rect class="cls-1" height="32" width="32"/></g></svg>
                  </button>
                  
                  <div class="date__list-btn-bar" data-js-date-item-btn-bar>
                    <button class="date__list-btn" type="button" data-js-date-redact-open>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000"/>
                        </svg>
                    </button>
                    <button class="date__list-btn" type="button" data-js-date-item-delete>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                  </div>
                </li>
            `
        }).join('');

        //встраиваем элементы списка в ul
        this.listElement.html(dayItems);

        //создаем событие, когда встроили список дней на страницу
        $(document).trigger('createDaysList');
    }

    //при клике по кнопке "Найти дату
    clickToFindDate = async () => {
        //удаляем из введенных данных всё кроме цифр
        let [day, month, year] = this.days.deleteUnnecessary(
            [$(this.searchInputElements[0]).val(),
            $(this.searchInputElements[1]).val(),
            $(this.searchInputElements[2]).val()]
        )

        //преобразуем дату к нужному виду
        let correctDate = this.days.correctDate([day, month, year]);
        day = correctDate[0];
        month = correctDate[1];
        year = correctDate[2];

        //проверяем на правильность введенных данных
        let check = await this.days.checkCorrectDate(day, month, year);

        //если данные корректны - получаем выбранные даты
        if (check) {
            //отображаем анимацию загрузки
            this.loadingElement.addClass(this.classes.isActive);
            //отображаем блок noData
            this.noDataElement.addClass(this.classes.isActive);
            //очищаем список дней
            this.listElement.empty();

            //получаем нужные дни
            this.getDays([day, month, year]);
        }
    }

    //задаем класс активного дня выбранному дню
    setDayActiveClass (index) {
        //удаляем классы у всех элементов
        this.itemElements.each((index, element) => $(element).removeClass(this.classes.isActive));

        //задаем активный класс нужному элементу
        $(this.itemElements[index]).addClass(this.classes.isActive);
    }

    //клик-выбор дня
    clickToDay = async (day, index) => {
        //задаем класс активного дня выбранному дню
        this.setDayActiveClass(index);

        //проверка на существование этого дня на сервере
        let check = await this.days.getDate(0, 1, [day.day, day.month, day.year]);

        if (check.data.length) {
            //клик сработает, если этот день еще не выбран
            if (Days.activeDay?.date_info !== day.date_info) {
                //задаем активный день
                Days.activeDay = day;

                //создаем событие для обновления данных журнала
                $(document).trigger('updateDate');
            }
        } else {
            await setAlert('День был изменен/удален.. Страница будет перезагружена!!');
            location.reload();
        }
    }

    //удаляем день и меняем активный день
    setNewDay = async (dateInfo) => {
        //порядковый номер дня в списке дней
        let index;

        //удаляем день из списка дней и получаем index удаленного элемента
        Days.daysList = Days.daysList.filter((day, elemIndex) => {
            if (day.date_info === dateInfo) {
                index = elemIndex;
                return false;
            }
            return true;
        });

        //удаляем элемент удаленного дня из списка дней
        $(this.itemElements[index]).remove();

        //если мы удалили последний день - очищаем classes
        if (Days.daysList.length === 0) {
            Classes.activeClasses = [];

            //создаем событие для перерисовки журнала (чтобы сделать его пустым)
            $(document).trigger('removeClasses');
        } else {
            //если удаленный день был активным днем, то делаем активным днем следующий день в списке дней
            if (Days.activeDay.date_info === dateInfo) {
                Days.activeDay = {};

                //выбираем первый элемент списка дней как активный день
                this.clickToDay(Days.daysList[0], 0);
            }
        }
    }

    //при клике по кнопке удаления дня
    clickToDelete = async (dateInfo) => {
        let confirmed = await setConfirm('Вы действительно хотите удалить выбранный день?');

        if (confirmed) {
            this.deleteDay(dateInfo);
        }
    }

    //закрытие всех btn-bar в элементах списка дней
    closeAllBtnBars () {
        this.itemBtnBarElements?.each((index, element) => $(element).removeClass(this.classes.isActive));
    }

    //при прокрутке, если добрались до низа списка, то догружаем еще элементы дней
    scrollDays = async () => {
        let height = this.listElement.outerHeight(true);

        if ((height - this.listElement.scrollTop()) < 50 && this.remainingNumber !== 0) {
            //получаем еще 20 дней
            let days = await this.days.getDate(Days.daysList.length, 20);

            //добавляем эти дни в список дней
            Days.daysList.push(...days.data);

            //обновляем переменную количества дней, оставшихся на сервере
            this.remainingNumber = days.remaining;

            //обновляем список дней
            this.createDaysList(Days.daysList);
        }
    }

    //debounce функция
    debounce (func, delay) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func()
            }, delay);
        };
    }
    //==============================================================//
}