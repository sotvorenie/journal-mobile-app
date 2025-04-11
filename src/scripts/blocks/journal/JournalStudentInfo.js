import Students from "../../globals/store/useStudents.js";
import Days from "../../globals/store/useDays.js";
import User from "../../globals/store/useUser.js";
import Groups from "../../globals/store/useGroups.js";
import Classes from "../../globals/store/useClasses.js";

import {getStudentPasses} from "../../../api/students.js";

import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";

export default class JournalStudentInfo {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        person: '[data-js-person]',
        personOpenVertical: '[data-js-person-open-vertical]',
        personOpenHorizontal: '[data-js-person-open-horizontal]',
        personClose: '[data-js-person-close]',
        personLoading: '[data-js-person-loading]',
        personName: '[data-js-person-name]',
        personDateOpen: '[data-js-person-date-open]',
        personDate: '[data-js-person-date]',
        personDateBtn: '[data-js-person-date-btn]',
        personInfo: '[data-js-person-info]',
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
        this.students = new Students();

        this.personElement = $(this.selectors.person);
        this.personCloseBnt = this.personElement.find(this.selectors.personClose);
        this.personLoadingElement = this.personElement.find(this.selectors.personLoading);
        this.personNameElement = this.personElement.find(this.selectors.personName);
        this.personDateOpen = this.personElement.find(this.selectors.personDateOpen);
        this.personDateElement = this.personElement.find(this.selectors.personDate);
        this.personDateBtns = this.personElement.find(this.selectors.personDateBtn);
        this.personInfoElements = this.personElement.find(this.selectors.personInfo);

        //массив элементов списка personList
        this.personListItems = [
            'За неделю',
            'За месяц',
            'За семестр',
            'За год'
        ];
        //массив количества пропусков блока person
        this.personInfoArr = {
            "н": 0,
            "о": 0,
            "б": 0
        }

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //получаем кнопки открытия блока person когда загрузились таблицы журнала
        $(document).on('tablesLoad', () => {
            this.personOpenVerticalBtns = $(this.selectors.personOpenVertical);
            this.personOpenHorizontalBtns = $(this.selectors.personOpenHorizontal);

            //клик по кнопке открытия personBlock в vertical журнале
            this.personOpenVerticalBtns.each((index, btn) => {
                if (Days.activeDay.date_info) {
                    $(btn).on('click', () => {
                        //заполняем блок информацией
                        this.setInfoToPersonBlock(Classes.activeClasses[index].student_id);

                        openBlock(this.personElement, btn);
                    })
                }
            })

            //клик по кнопке открытия personBlock в horizontal журнале
            this.personOpenHorizontalBtns.each((index, btn) => {
                if (Days.activeDay.date_info) {
                    $(btn).on('click', () => {
                        //заполняем блок информацией
                        this.setInfoToPersonBlock(Classes.activeClasses[index].student_id);

                        openBlock(this.personElement, btn);
                    })
                }
            })
        })

        //устанавливаем расположение блока выбора дат в personBlock
        this.setDateBlockPosition();
        //при изменении ориентации экрана меняем расположение блока выбора дат в personBlock
        $(window).on('resize', this.setDateBlockPosition.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке закрытия блока person
        this.personCloseBnt.on('click', () => {
            closeBlock(this.personElement);
        })

        //клик по кнопке открытия списка дат в personBlock
        this.personDateOpen.on('click', () => {
            this.personDateElement.toggleClass(this.classes.isActive);
        })

        //клик по элементу списка дат в personBlock
        this.personDateBtns.each((index, btn) => {
            $(btn).on('click', () => {
                //закрываем блок списка дат
                this.personDateElement.removeClass(this.classes.isActive);

                this.getDateForServer(this.personListItems[index]);
            })
        })
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //получаем количество пропусков студента
    getPasses = async (from) => {
        try {
            //показываем анимацию загрузки
            this.personLoadingElement.addClass(this.classes.isActive);

            let data = `?user_id=${User.activeUser.id}
                                  &group_id=${Groups.activeGroup.id}
                                  &student_id=${Students.activeStudent.id}
                                  &from=${from}&to=${Days.activeDay.date_info}`;

            const response = await getStudentPasses(data);

            if (response.status === 200) {
                this.personInfoArr = response.data;

                //заполняем информацию о количестве пропусков
                this.setNumbersToPersonBlock();
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
        finally {
            //скрываем анимацию загрузки
            this.personLoadingElement.removeClass(this.classes.isActive);
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //заполняем personBlock информацией о студенте
    setInfoToPersonBlock (id) {
        Students.activeStudent = Students.students.find(student => student.id === id);

        //задаем фамилию и имя активного студента
        this.personNameElement.text(`${Students.activeStudent.second_name} ${Students.activeStudent.name}`);

        //получаем изначально количество пропусков за неделю
        this.getDateForServer(this.personListItems[0]);
    }

    //заполняем информацию о количестве пропусков
    setNumbersToPersonBlock () {
        $(this.personInfoElements[0]).text(this.personInfoArr["н"]);
        $(this.personInfoElements[1]).text(this.personInfoArr["о"]);
        $(this.personInfoElements[2]).text(this.personInfoArr["б"]);
    }

    //функция получения дня, месяца и года той даты, которая сейчас в activeDate
    getActiveDateInfo () {
        let day = parseInt(Days.activeDay.day, 10);
        let month = parseInt(Days.activeDay.month, 10) - 1; //месяцы в JS начинаются с 0
        let year = parseInt(Days.activeDay.year, 10);

        return {
            day,
            month,
            year
        }
    }

    //получаем данные о дате для сервера
    //dateInfo - полученная строка с выбранным значением option
    getDateForServer (dateInfo) {
        //переменная даты, с которой будет начинаться поиск, для сервера
        let fromDate = '';

        //в зависимости от того, что выбрал пользователь, вызываем разные функции получения дат
        switch (dateInfo) {
            case this.personListItems[0]:
                fromDate = this.getDateForWeek();
                break;
            case this.personListItems[1]:
                fromDate = this.getDateForMonth();
                break;
            case this.personListItems[2]:
                fromDate = this.getDateForSemester();
                break;
            case this.personListItems[3]:
                fromDate = this.getDateForYear();
                break;
        }

        //вызываем функцию получения количества пропусков
        this.getPasses(fromDate);
    }

    //если пользователь выбрал "За неделю"
    getDateForWeek () {
        //получаем информацию об активной дате
        let {day, month, year} = this.getActiveDateInfo();

        const date = new Date(year, month, day);

        let newDate = date.setDate(date.getDate() - 7);

        const formattedDate = new Date(newDate);

        return `${String(formattedDate.getDate()).padStart(2, '0')}
          ${String(formattedDate.getMonth() + 1).padStart(2, '0')}
          ${formattedDate.getFullYear()}`;
    }

    //если пользователь выбрал "За месяц"
    getDateForMonth () {
        //получаем информацию об активной дате
        let {day, month, year} = this.getActiveDateInfo();

        const date = new Date(year, month, day);

        const newDate = date.setMonth(date.getMonth() - 1);

        const formattedDate = new Date(newDate);

        return `${String(formattedDate.getDate()).padStart(2, '0')}
          ${String(formattedDate.getMonth() + 1).padStart(2, '0')}
          ${formattedDate.getFullYear()}`;
    }

    //если пользователь выбрал "За семестр"
    getDateForSemester () {
        //получаем информацию об активной дате
        let {month, year} = this.getActiveDateInfo();

        if (month < 8 && month >= 0) {
            return `0101${year}`;
        } else if (month >= 8 && month <= 11) {
            return `0109${year}`;
        }
    }

    //если пользователь выбрал "За год"
    getDateForYear () {
        //получаем информацию об активной дате
        let {month, year} = this.getActiveDateInfo();

        if (month < 8 && month >= 0) {
            return `0109${year - 1}`;
        } else if (month >= 8 && month <= 11) {
            return `0109${year}`;
        }
    }

    //изменяем положение блока выбора дат в personBlock в зависимости от ориентации экрана
    setDateBlockPosition () {
        if (window.innerWidth < window.innerHeight) {
            this.personDateElement.css({
                transformOrigin: 'center bottom',
                bottom: '-80%',
                right: '-30%'
            })
        } else {
            this.personDateElement.css({
                transformOrigin: 'right center',
                right: '-5%',
                bottom: '-300%'
            })
        }
    }
    //==============================================================//
}