import Swiper from "swiper";
import 'swiper/css';

import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";
import {setMessage} from "../../utils/useMessage.js";
import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {input} from "../../utils/useInput.js";
import {redactValidation} from "../../utils/useValidationRedact.js";

import User from "../../globals/store/useUser.js";
import Groups from "../../globals/store/useGroups.js";
import Days from "../../globals/store/useDays.js";
import Lessons from "../../globals/store/useLessons.js";
import Students from "../../globals/store/useStudents.js";

import {createNewDay} from "../../../api/days.js";
import {createNewClasses} from "../../../api/classes.js";

export default class JournalDateCreate {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-date-create]',
        swiper: '[data-js-date-create-swiper]',
        open: '[data-js-date-create-open]',
        close: '[data-js-date-create-close]',
        counter: '[data-js-date-create-counter]',
        name: '[data-js-date-create-name]',
        dayInput: '[data-js-date-create-day]',
        dayCounter: '[data-js-date-create-day-counter]',
        monthInput: '[data-js-date-create-month]',
        monthCounter: '[data-js-date-create-month-counter]',
        yearInput: '[data-js-date-create-year]',
        yearCounter: '[data-js-date-create-year-counter]',
        todayBtn: '[data-js-date-create-today]',
        prevBtn: '[data-js-date-create-prev]',
        nextBtn: '[data-js-date-create-next]',
        loading: '[data-js-date-create-loading]',
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

        this.createElement = $(this.selectors.root);
        this.openBtn = $(this.selectors.open);
        this.closeBtn = this.createElement.find(this.selectors.close);
        this.counterElement = this.createElement.find(this.selectors.counter);
        this.nameElement = this.createElement.find(this.selectors.name);
        this.dayInputElement = this.createElement.find(this.selectors.dayInput);
        this.dayCounterElement = this.createElement.find(this.selectors.dayCounter);
        this.monthInputElement = this.createElement.find(this.selectors.monthInput);
        this.monthCounterElement = this.createElement.find(this.selectors.monthCounter);
        this.yearInputElement = this.createElement.find(this.selectors.yearInput);
        this.yearCounterElement = this.createElement.find(this.selectors.yearCounter);
        this.todayBtn = this.createElement.find(this.selectors.todayBtn);
        this.prevBtn = this.createElement.find(this.selectors.prevBtn);
        this.nextBtn = this.createElement.find(this.selectors.nextBtn);
        this.loadingElement = this.createElement.find(this.selectors.loading);

        //инициализация слайдера
        this.swiperElement = new Swiper(this.selectors.swiper, {
            effect: 'flip',
            allowTouchMove: false,
        });

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //очищаем поля ввода и ставим counter = 1, а также ставим counter-ы в полях ввода = 0
        this.clearInfo();
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке открытия блока
        this.openBtn.on('click', () => {
            this.createElement.addClass(this.classes.isActive);

            openBlock(this.createElement, this.openBtn[0]);
        })

        //клик по кнопке закрытия блока
        this.closeBtn.on('click', async () => {
            await  closeBlock(this.createElement);

            this.createElement.addClass(this.classes.isActive);
        })
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //создаем день
    createDay = async (lessons, date) => {
        try {
            //показываем анимацию загрузки
            setLoading(this.nextBtn, this.loadingElement);

            let data = {
                user_id: User.activeUser.id,
                group_id: Groups.activeGroup.id,
                date_info: `${date[0]}${date[1]}${date[2]}`,
                day: date[0],
                month: date[1],
                year: date[2],
                first_lesson: lessons[0],
                second_lesson: lessons[1],
                third_lesson: lessons[2],
                fourth_lesson: lessons[3],
                fifth_lesson: lessons[4]
            }

            const response = await createNewDay(data);

            if (response.status === 200) {
                //создаем classes
                await this.createClasses(data);
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //создаем classes
    createClasses = async (day) => {
        try {
            let data = [];

            Students.students.forEach(student => {
                data.push({
                    user_id: User.activeUser.id,
                    group_id: Groups.activeGroup.id,
                    student_id: student.id,
                    date_info: `${day.day}${day.month}${day.year}`,
                    first_lesson: '',
                    second_lesson: '',
                    third_lesson: '',
                    fourth_lesson: '',
                    fifth_lesson: ''
                })
            })

            const response = await createNewClasses(data);

            if (response.status === 200) {
                //добавляем день в список дней
                Days.daysList.unshift(day);

                //выбираем созданный день как активный
                Days.activeDay = day;

                //создаем событие, чтобы выбрать созданный день как активный
                $(document).trigger('createDay');

                //сообщаем, что все прошло успешно
                setMessage('День добавлен!!');

                //закрываем блок
                closeBlock(this.createElement);
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //скрываем анимацию загрузки
            setLoading(this.nextBtn, this.loadingElement);
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //очищаем поля ввода и ставим counter = 1, а также ставим counter-ы в полях ввода = 0
    clearInfo () {
        this.counterElement.text(1);

        //очищаем поля ввода
        this.dayInputElement.val('');
        this.monthInputElement.val('');
        this.yearInputElement.val('');

        //устанавливаем значение в counter-ы полей ввода = 0
        this.dayCounterElement.text(0);
        this.monthCounterElement.text(0);
        this.yearCounterElement.text(0);

        //листаем на первый слайд
        this.swiperElement.slideTo(0);
    }

    //клик по кнопке "Далее"
    clickToNext () {
        if (this.swiperElement.activeIndex === 0) {
            this.clickToNextFirst();
        }
    }

    //клик по кнопке "Далее" на первом слайде
    clickToNextFirst = async () => {
        let check = this.correctDate();

        //если дата корректна, то переходим на следующий слайд, а если нет - делаем кнопку некликабельной
        if (check[0]) {
            //проверяем, чтобы такой даты уже не существовало
            let doubleCheck = await this.days.getDate(0, 1, [check[1].day, check[1].month, check[1].year]);

            if (!doubleCheck.data.length) {
                this.swiperElement.slideTo(1)
            } else {
                await setAlert('Такая дата уже существует!!');
            }
        } else {
            this.nextBtn.attr('disabled', true);
        }
    }

    //корректирование даты
    correctDate () {
        //удаляем из введенных данных всё кроме цифр
        let [day, month, year] =
            this.days.deleteUnnecessary(
                [this.dayInputElement.val(),
                    this.monthInputElement.val(),
                    this.yearInputElement.val()]
            );

        //преобразуем дату к нужному виду
        let correctDate = this.days.correctDate(day, month, year);
        day = correctDate[0];
        month = correctDate[1];
        year = correctDate[2];

        //проверяем на правильность введенных данных
        //если данные корректны - возвращаем true, а также корректную информацию о дне
        return [this.days.checkCorrectDate(day, month, year), {day, month, year}];
    }
    //==============================================================//
}