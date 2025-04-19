import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";
import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";
import {setMessage} from "../../utils/useMessage.js";
import {setLoading} from "../../utils/useSetLoading.js";

import Days from "../../globals/store/useDays.js";
import User from "../../globals/store/useUser.js";
import Groups from "../../globals/store/useGroups.js";
import Lessons from "../../globals/store/useLessons.js";

import {updateDay} from "../../../api/days.js";
import {updateClassesInfo} from "../../../api/classes.js";

export default class JournalDateRedact {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-date-redact]',
        open: '[data-js-date-redact-open]',
        input: '[data-js-date-redact-input]',
        selectLoading: '[data-js-date-redact-select-loading]',
        select: '[data-js-date-redact-select]',
        close: '[data-js-date-redact-close]',
        redact: '[data-js-date-redact-btn]',
        btnLoading: '[data-js-date-redact-btn-loading]',
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

        this.redactElement = $(this.selectors.root);

        this.inputElements = this.redactElement.find(this.selectors.input);
        this.selectLoadingElements = this.redactElement.find(this.selectors.selectLoading);
        this.selectElements = this.redactElement.find(this.selectors.select);
        this.closeBtn = this.redactElement.find(this.selectors.close);
        this.redactBtn = this.redactElement.find(this.selectors.redact);
        this.btnLoadingElement = this.redactElement.find(this.selectors.btnLoading);

        //переменная, хранящая день, который редактируем
        this.redactDayInfo = {};

        //переменная, хранящая массив названия предметов
        this.lessons = [];

        //переменные, хранящие приведенные к нужному виду даты
        this.day = '';
        this.month = '';
        this.year = '';

        this.loadFunctions();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //событие когда добавили список дней на страницу
        $(document).on('createDaysList', () => {
            this.openBtns = $(this.selectors.open);

            this.bindEvents();
        })
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        this.openBtns.off('click');
        this.closeBtn.off('click');
        this.redactBtn.off('click');

        //клик по кнопке открытия блока
        this.openBtns.each((index, btn) => {
            $(btn).on('click', (event) => {
                this.openBlock(btn, index);

                //добавляем списки предметов
                this.getRedactDayLessons();

                event.stopPropagation();
            })
        })

        //клик по кнопке закрытия блока
        this.closeBtn.on('click', () => {
            closeBlock(this.redactElement);
        })

        //клик по кнопке "Изменить"
        this.redactBtn.on('click', this.clickToRedact.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //редактирование дня
    redactDay = async (lessons) => {
        try {
            //показываем анимацию в кнопке "Изменить"
            setLoading(this.redactBtn, this.btnLoadingElement);

            let data = {
                user_id: User.activeUser.id,
                group_id: Groups.activeGroup.id,
                date_info: this.redactDayInfo.date_info,
                day: this.day,
                month: this.month,
                year: this.year,
                first_lesson: lessons[0],
                second_lesson: lessons[1],
                third_lesson: lessons[2],
                fourth_lesson: lessons[3],
                fifth_lesson: lessons[4]
            }

            const response = await updateDay(data);

            if (response.status === 200) {
                await this.redactClasses(data);
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //редактируем classes
    redactClasses = async (newDay) => {
        try {
            let data = {
                user_id: newDay.user_id,
                group_id: newDay.group_id,
                date_info: this.redactDayInfo.date_info,
                new_date: `${newDay.day}${newDay.month}${newDay.year}`
            }

            const response = await updateClassesInfo(data);

            if (response.status === 200) {
                //индекс редактируемого дня в списке дней
                let indexDay = -1;
                //показываем: нужно ли изменять индекс или нет
                let value = false;

                //если мы обновляли activeDay, то обновляем его данные и данные в classes и данные lessons
                if (Days.activeDay.date_info === this.redactDayInfo.date_info){
                    Days.activeDay = newDay;

                    let arr = ['first_lesson', 'second_lesson', 'third_lesson', 'fourth_lesson', 'fifth_lesson']

                    //обновляем данные о предметах
                    for (let i = 0; i < 5; i++) {
                        Lessons.activeLessons[i] = Lessons.lessons.find(lesson => lesson.id === newDay[arr[i]])?.name;
                    }

                    value = true;
                }

                //обновляем данные в списке дней
                Days.daysList = Days.daysList.map((day, index) => {
                    if (day.date_info === this.redactDayInfo.date_info) {
                        if (value) {
                            indexDay = index;
                        }

                        return {
                            ...newDay,
                            date_info: `${newDay.day}${newDay.month}${newDay.year}`
                        };
                    } else {
                        return day;
                    }
                })

                //создаем событие редактирования дня
                $(document).trigger('redactDay', indexDay);

                //выводим сообщение
                setMessage('День изменен!!');

                //закрываем блок
                closeBlock(this.redactElement);

            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //скрываем анимацию в кнопке "Изменить"
            setLoading(this.redactBtn, this.btnLoadingElement);
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //открытие блока
    openBlock (btn, index) {
        this.redactDayInfo = Days.daysList[index];

        openBlock(this.redactElement, btn);

        //задаем данные дня в поля ввода
        $(this.inputElements[0]).val(this.redactDayInfo.day);
        $(this.inputElements[1]).val(this.redactDayInfo.month);
        $(this.inputElements[2]).val(this.redactDayInfo.year);
    }

    //получаем предметы в редактируемый день
    getRedactDayLessons () {
        //получаем id предметов в редактируемый день
        let lessonsID = [
            this.redactDayInfo.first_lesson,
            this.redactDayInfo.second_lesson,
            this.redactDayInfo.third_lesson,
            this.redactDayInfo.fourth_lesson,
            this.redactDayInfo.fifth_lesson
        ];

        //получаем массив предметов в редактируемый день
        this.lessons = lessonsID.map(id => {
            if (id === null) {
                return null;
            }
            const obj = Lessons.lessons.find(lesson => lesson?.id === id);
            return obj ? obj?.name : null;
        })

        //создаем options
        this.createOptions();
    }

    //заполняем select-ы списком предметов
    createOptions () {
        for (let i = 0; i < 5; i++) {
            //создаем элементы options
            let optionItems = [`<option class="option" selected>ничего</option>`];

            Lessons.lessons.forEach(lesson => {
                optionItems.push(`
                    <option class="option">${lesson.name}</option>
                `)
            })

            //встраиваем options в selected
            $(this.selectElements[i]).html(optionItems.join(''));
        }

        //выбираем активный предметы
        this.setActiveLessons();
    }

    //выбираем активные предметы
    setActiveLessons () {
        let arr = ['first_lesson', 'second_lesson', 'third_lesson', 'fourth_lesson', 'fifth_lesson'];
        for (let i = 0; i < 5; i++) {
            if (this.redactDayInfo[arr[i]] !== null) {
                let lessonIndex;
                Lessons.lessons.forEach((lesson, index) => {
                    if (lesson.id === this.redactDayInfo[arr[i]]) {
                        lessonIndex = index;
                    }
                })

                this.selectElements[i].selectedIndex = lessonIndex + 1;
            }
        }

        //убираем анимации загрузки у списков предметов
        this.removeSelectLoading();
    }

    //убираем анимации загрузки у списков предметов
    removeSelectLoading () {
        this.selectLoadingElements.each((index, element) => {
            $(element).removeClass(this.classes.isActive);

            this.closeBtn.attr('disabled', false);
            this.redactBtn.attr('disabled', false);
        })
    }

    //клик по кнопке "Изменить"
    clickToRedact = async () => {
        let confirmed = await setConfirm('Вы действительно хотите редактировать день?');

        if (confirmed) {
            this.successToRedactDate();
        }
    }

    //получение редактированных предметов
    getRedactLessons () {
        let arrLessons = [];
        let indexesLessons = [];

        //получаем массив index-ов предметов с select-ов
        this.selectElements.each((index, element) => {
            if (element.selectedIndex === 0) {
                indexesLessons.push(null);
            } else {
                indexesLessons.push(element.selectedIndex - 1);
            }
        })

        //получаем массив выбранных предметов
        indexesLessons.forEach(index => {
            arrLessons.push(Lessons.lessons[index]?.id ?? null);
        })

        return arrLessons;
    }

    //при подтверждении о редактировании дня
    successToRedactDate = async () => {
        //проверяем корректность даты
        let check = this.correctDate();

        if (check) {
            //проверяем, чтобы такой даты уже не существовало
            let doubleCheck = await this.days.getDate(0, 1, [this.day, this.month, this.year]);

            //если такой даты нет, то редактируем дату
            if (!doubleCheck.data.length || doubleCheck.data[0].date_info === this.redactDayInfo.date_info) {
                //получаем массив id предметов
                let lessons = this.getRedactLessons();

                //отправляем данные на сервер
                await this.redactDay(lessons);
            } else {
                await setAlert('Такая дата уже существует!!');
            }
        }
    }

    //приводим дату к нужному виду
    correctDate = async () => {
        //удаляем из введенных данных всё кроме цифр
        [this.day, this.month, this.year] =
            this.days.deleteUnnecessary([$(this.inputElements[0]).val(), $(this.inputElements[1]).val(), $(this.inputElements[2]).val()]);

        //преобразуем дату к нужному виду

        let redactDate = this.days.correctDate([this.day, this.month, this.year]);
        this.day = redactDate[0];
        this.month = redactDate[1];
        this.year = redactDate[2];

        //проверяем на правильность введенных данных
        let check = this.days.checkCorrectDate(this.day, this.month, this.year);

        //если данные корректны - возвращаем true
        if (check) {
            return true;
        } else {
            await setAlert('Некорректная дата');
            return false;
        }
    }
    //==============================================================//
}