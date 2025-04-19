import {getLessons} from "../../../api/lessons.js";

import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";

import User from "../../globals/store/useUser.js";
import Groups from "../../globals/store/useGroups.js";
import Lessons from "../../globals/store/useLessons.js";
import Days from "../../globals/store/useDays.js";
import Classes from "../../globals/store/useClasses.js";
import Students from "../../globals/store/useStudents.js";

export default class Journal {
//==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-journal]',
        back: '[data-js-journal-back]',

        group: '[data-js-journal-group]',
        date: '[data-js-journal-date]',

        loading: '[data-js-journal-loading]',
        nullList: '[data-js-journal-null-list]',
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

        this.journalElement = $(this.selectors.root);

        this.backBtn = this.journalElement.find(this.selectors.back);
        this.groupNameElement = this.journalElement.find(this.selectors.group);
        this.dateNameElement = this.journalElement.find(this.selectors.date);
        this.loadingElement = this.journalElement.find(this.selectors.loading);
        this.nullListElement = this.journalElement.find(this.selectors.nullList);

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = async () => {
        //задаем название группы в header
        this.setGroupName();

        //получаем последний день
        await this.getLastDay();

        //получаем данные для журнала
        this.updateData();

        //задаем последний день в header
        this.setDate();

        //при обновлении активной даты
        $(document).on('updateDate', () => {
            //получаем данные журнала
            this.updateData();

            //задаем активный день в header
            this.setDate();
        })

        //при редактировании активной даты
        $(document).on('redactDay', this.setDate.bind(this));

        //при удалении дня
        $(document).on('removeClasses', () => {
            this.setDate()

            //если classes нет - показываем null-list
            if (!Classes.activeClasses.length) {
                this.nullListElement.addClass(this.classes.isActive);
            }
        })
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке возврата на прошлую страницу
        this.backBtn.on('click', () => {
            window.location.href = '../../../../groups.html';
        });
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //получаем список предметов группы
    getLessons = async () => {
        try {
            let data = `?user_id=${User.activeUser.id}&group_id=${Groups.activeGroup.id}`;

            const response = await getLessons(data);

            if (response.status === 200) {
                Lessons.lessons = response.data;
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //получение последнего дня
    getLastDay = async () => {
        let day = await new Days().getDate(0, 1);

        if (day.data.length) {
            Days.activeDay = day.data[0];
        } else {
            Days.activeDay = {};
        }
    }

    //функция обновления данных при изменении последней даты
    updateData = async () => {
        //очищаем активный classes
        Classes.activeClasses = [];

        //скрываем блок null-list
        this.nullListElement.removeClass(this.classes.isActive);

        if (window.innerWidth < window.innerHeight) {
            //показываем анимацию загрузки в журнале
            this.loadingElement.addClass(this.classes.isActive);
        }

        //получаем список предметов группы
        await this.getLessons();

        //получаем список предметов выбранного дня
        this.getTodayLessons();

        //получаем список студентов
        await new Students().getStudents();

        //получаем ячейки журнала
        await new Classes().getClasses();

        //скрываем анимацию загрузки в журнале
        this.loadingElement.removeClass(this.classes.isActive);

        //если classes нет - показываем null-list
        if (!Classes.activeClasses.length) {
            this.nullListElement.addClass(this.classes.isActive);
        }

        //создаем событие для отрисовки журнала
        $(document).trigger('journalLoad');
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //задаем название группы в header
    setGroupName () {
        this.groupNameElement.text(Groups.activeGroup.name);
    }

    //задаем последнюю дату в header
    setDate () {
        let date = '';

        if (Days.activeDay.date_info) {
            date = `${Days.activeDay.day}.${Days.activeDay.month}.${Days.activeDay.year}`;
        }

        this.dateNameElement.text(date);
    }

    //получаем список предметов выбранного дня
    getTodayLessons () {
        //для начала очищаем массив активных предметов (на случай если в массиве уже были предыдущие предметы)
        Lessons.activeLessons = [];

        let activeLessons = [
            Days.activeDay.first_lesson,
            Days.activeDay.second_lesson,
            Days.activeDay.third_lesson,
            Days.activeDay.fourth_lesson,
            Days.activeDay.fifth_lesson,
        ]

        activeLessons.forEach(i => {
            let activeLesson = Lessons.lessons.find(s => s.id === i);

            Lessons.activeLessons.push(activeLesson?.name);
        })
    }
    //==============================================================//
}