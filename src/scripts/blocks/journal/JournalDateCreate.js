import Swiper from "swiper";
import 'swiper/css';

import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";
import {setMessage} from "../../utils/useMessage.js";
import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {input} from "../../utils/useInput.js";

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
        nextText: '[data-js-date-create-next-text]',
        loading: '[data-js-date-create-loading]',
        select: '[data-js-date-create-select]',
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
        this.nextTextElement = this.createElement.find(this.selectors.nextText);
        this.loadingElement = this.createElement.find(this.selectors.loading);
        this.selectElements = this.createElement.find(this.selectors.select);

        //инициализация слайдера
        this.swiperElement = new Swiper(this.selectors.swiper, {
            effect: 'flip',
            allowTouchMove: false,
        });

        //скорректированные день, месяц и год
        this.day = '';
        this.month = '';
        this.year = '';

        //переменная, отвечающая за "отрисованы ли списки предметов или нет", чтобы не добавлять списки повторно
        this.lessonsCreateCounter = false;
        //переменная, отвечающая за "были мы на втором слайде или нет", чтобы не делать проверку даты повторно
        this.dateCreateCounter = false;

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
        this.openBtn.on('click', async () => {
            if (Students.students.length) {
                openBlock(this.createElement, this.openBtn[0]);
            } else {
                await setAlert('Добавьте сначала хотя бы одного студента!!');
            }
        })

        //клик по кнопке закрытия блока
        this.closeBtn.on('click', async () => {
            await closeBlock(this.createElement);

            //очищаем данные и поля ввода
            this.clearInfo();

            this.lessonsCreateCounter = false;
            this.dateCreateCounter = false;
        })

        //при вводе в input дня
        this.dayInputElement.on('input', (event) => {
            input(event, this.dayCounterElement);

            this.dateCreateCounter = false;
        })

        //при вводе в input месяца
        this.monthInputElement.on('input', (event) => {
            input(event, this.monthCounterElement);

            this.dateCreateCounter = false;
        })

        //при вводе в input года
        this.yearInputElement.on('input', (event) => {
            input(event, this.yearCounterElement);

            this.dateCreateCounter = false;
        })

        //при клике на кнопку "Далее"
        this.nextBtn.on('click', () => {
            this.clickToNext();
        })

        //при клике на кнопку "Назад"
        this.prevBtn.on('click', () => {
            this.clickToPrevSlide();
        })

        //при клике на кнопку "Сегодняшняя дата"
        this.todayBtn.on('click', this.clickToToday.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //создаем день
    createDay = async (lessons) => {
        try {
            //показываем анимацию загрузки
            setLoading(this.nextBtn, this.loadingElement);

            let data = {
                user_id: User.activeUser.id,
                group_id: Groups.activeGroup.id,
                date_info: `${this.day}${this.month}${this.year}`,
                day: this.day,
                month: this.month,
                year: this.year,
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
            console.log(data, Students.students)

            const response = await createNewClasses(data);

            if (response.status === 200) {
                //добавляем день в список дней
                Days.daysList.unshift(day);

                //создаем событие, чтобы выбрать созданный день как активный
                $(document).trigger('createDay');

                //сообщаем, что все прошло успешно
                setMessage('День добавлен!!');

                //закрываем блок
                closeBlock(this.createElement);

                this.clearInfo();
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
    //очищаем данные и листаем к первому слайду
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

        //меняем надписи
        this.nameElement.text('Формирование даты');
        this.nextTextElement.text('Далее');
    }

    //клик по кнопке "Далее"
    clickToNext = async () => {
        if (this.swiperElement.activeIndex === 0) {
            await this.clickToNextFirst();
        } else {
            //меняем текст в кнопке "Далее"
            this.nextTextElement.text('Готово');

            //нажатие на кнопку "Готово"
            let confirmed = await setConfirm('Вы действительно хотите добавить дату?');

            if (confirmed) {
                this.clickToReady();
            }
        }

        this.counterElement.text(this.swiperElement.activeIndex + 1);
    }

    //клик по кнопке "Далее" на первом слайде
    clickToNextFirst = async () => {
        try {
            //показываем анимацию загрузки
            setLoading(this.nextBtn, this.loadingElement);

            //проверяем, чтобы все поля вода были заполнены
            let check = this.checkInputLength();

            if (check) {
                let check2 = this.correctDate();

                //если дата корректна, то переходим на следующий слайд, а если нет - выводим ошибку
                if (check2) {
                    //проверяем, чтобы такой даты уже не существовало (проверку делаем, если на втором слайде мы не были и дату не меняли)
                    let doubleCheck;
                    if (!this.dateCreateCounter) {
                        doubleCheck = await this.days.getDate(0, 1, [this.day, this.month, this.year]);
                    }

                    if (!doubleCheck?.data?.length || this.dateCreateCounter) {
                        //создаем списки предметов, если он еще не создан
                        if (!this.lessonsCreateCounter) {
                            //создаем списки предметов
                            this.createSelects();

                            //вносим данные о том, что списки предметов отрисованы, чтобы повторно их не создавать
                            this.lessonsCreateCounter = true;
                        }

                        //вносим данные о том, что на втором слайде мы были, чтобы второй раз не делать проверку на дату, если мы захотим вернуться на первый слайд
                        this.dateCreateCounter = true;

                        this.nameElement.text('Выбор предметов');

                        this.nextTextElement.text('Готово');

                        //листаем на второй слайд
                        this.swiperElement.slideTo(1);

                        //делаем кнопку "Назад" активной
                        this.prevBtn.attr('disabled', false);
                    } else {
                        await setAlert('Такая дата уже существует!!');
                    }
                } else {
                    await setAlert('Введенная дата некорректна!!');
                }
            } else {
                await setAlert('Заполните все поля ввода!!');
            }
        } catch (err) {
            await setAlert(err);
        } finally {
            //скрываем анимацию загрузки
            setLoading(this.nextBtn, this.loadingElement);
        }
    }

    //проверяем, что все поля ввода заполнены
    checkInputLength () {
        return this.dayInputElement.val().length > 0
                    && this.monthInputElement.val().length > 0
                    && this.yearInputElement.val().length > 0;
    }

    //корректирование даты
    correctDate () {
        //удаляем из введенных данных всё кроме цифр
        [this.day, this.month, this.year] =
            this.days.deleteUnnecessary(
                [this.dayInputElement.val(),
                    this.monthInputElement.val(),
                    this.yearInputElement.val()]
            );

        //преобразуем дату к нужному виду
        let correctDate = this.days.correctDate([this.day, this.month, this.year]);
        this.day = correctDate[0];
        this.month = correctDate[1];
        this.year = correctDate[2];

        //проверяем на правильность введенных данных
        //если данные корректны - возвращаем true, а также корректную информацию о дне
        return this.days.checkCorrectDate(this.day, this.month, this.year);
    }

    //клик по кнопке "Готово" проверяем на существование даты и создаем массив данных для сервера
    clickToReady () {
        //отправляем данные на сервер
        this.createDay(this.getIDSubjects());
    }

    //получаем массив ID предметов по названиям предметов
    getIDSubjects () {
        let lessonID = [];

        for (let i = 0; i < 5; i++) {
            let index = this.selectElements[i].selectedIndex;

            if (index === 0) {
                lessonID.push(null);
                continue;
            }

            lessonID.push(Lessons.lessons[index - 1].id);
        }

        return lessonID;
    }

    //при клике на кнопку "Назад"
    clickToPrevSlide () {
        if (this.swiperElement.activeIndex === 1) {
            this.prevBtn.attr('disabled', true);
            this.nextTextElement.text('Далее');
        }

        this.swiperElement.slidePrev();

        this.counterElement.text(this.swiperElement.activeIndex + 1);
        this.nameElement.text('Формирование даты');
    }

    //при клике на кнопку "Сегодняшняя дата", чтобы добавить данные о сегодняшней дате
    clickToToday () {
        let date = new Date();

        this.dayInputElement.val(date.getDate());
        this.monthInputElement.val(date.getMonth() + 1);
        this.yearInputElement.val(date.getFullYear());
    }

    //создание списков предметов
    createSelects () {
        for (let i  = 0; i < 5; i++) {
            //создаем элементы option
            let optionList = [`<option class="option" selected data-js-date-create-option>ничего</option>`];

            Lessons.lessons.forEach(lesson => {
                optionList.push(`
                <option class="option" data-js-date-create-option>${lesson.name}</option>
            `)
            })

            //встраиваем option в select
            $(this.selectElements[i]).html(optionList.join(''));
        }
    }
    //==============================================================//
}