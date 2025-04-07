import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";

import {updateClasses} from "../../../api/classes.js";

import Classes from "../../globals/store/useClasses.js";
import Students from "../../globals/store/useStudents.js";
import Days from "../../globals/store/useDays.js";

export default class JournalTable {
//==============================================================//
    //---DOM-селекторы--//
    selectors = {
        verticalJournal: '[data-js-journal-table-list]',

        accordion: '[data-js-journal-accordion]',
        accordionIcon: '[data-js-journal-accordion-icon]',
        accordionList: '[data-js-journal-accordion-list]',
        accordionItem: '[data-js-journal-accordion-item]',
        accordionMarks: '[data-js-journal-accordion-marks-list]',
        accordionMarksItem: '[data-js-journal-accordion-marks-item]',
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

        this.verticalJournalElement = $(this.selectors.verticalJournal);

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //при событии, когда мы получили classes журнала
        $(document).on('journalLoad', async () => {
            //создаем вертикальный журнал
            await this.createVerticalJournal();

            //получаем элементы accordion
            this.accordionElements = $(this.selectors.accordion);
            this.accordionIconElements = this.accordionElements.find(this.selectors.accordionIcon);
            this.accordionListElements = this.accordionElements.find(this.selectors.accordionList);
            this.accordionItemElements = this.accordionElements.find(this.selectors.accordionItem);
            this.accordionMarksElements = this.accordionElements.find(this.selectors.accordionMarks);
            this.accordionMarksItemElements = this.accordionElements.find(this.selectors.accordionMarksItem);

            //переменная, хранящая старое состояние classes, чтобы в случаем ошибки можно было откатиться до этого состояния
            this.oldClasses = {};

            //при клике на элемент-список accordion
            this.accordionElements.each((index, element) => {
                $(element).on('click', () => {
                    this.openCloseAccordion(index);
                })
            })

            //при клике на элемент ячейки журнала в вертикальном журнале
            this.accordionItemElements.each((index, element) => {
                $(element).on('click', (event) => {
                    this.openMarksBlock(index);

                    event.stopPropagation();
                })
            })

            //при клике на элемент mark
            this.accordionMarksItemElements.each((index, element) => {
                $(element).on('click', () => {
                    this.clickToMark(index, $(element).text());
                })
            })
        })
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {

    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //изменяем данные в журнале
    redactClasses = async (item) => {
        try {
            const response = await updateClasses(item);

            if (response.status !== 200) {
                this.returnClasses();

                await setAlert('Что-то пошло не так..');
            }

        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //создание списка журнала в вертикальном положении
    createVerticalJournal = async () => {
        return new Promise((resolve) => {
            //создаем элементы li
            let accordionItem = Classes.activeClasses.map((item, index) => {
                return `
                <li class="journal__item accordion" data-js-journal-accordion>
                    <div class="accordion__student">
                      <p class="slice-string h4">${Students.students[index].second_name} ${Students.students[index].name}</p>
                      <span class="accordion__icon" data-js-journal-accordion-icon>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="#0F0F0F"/>
                        </svg>
                      </span>
                    </div>
                    
                    <ul class="accordion__list" data-js-journal-accordion-list>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].first_lesson}</span>
                            <ul class="accordion__item-marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].second_lesson}</span>
                            <ul class="accordion__item-marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].third_lesson}</span>
                            <ul class="accordion__item-marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].fourth_lesson}</span>
                            <ul class="accordion__item-marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].fifth_lesson}</span>
                            <ul class="accordion__item-marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            `
            }).join('');

            //встраиваем li в ul
            this.verticalJournalElement.html(accordionItem);

            this.verticalJournalElement.addClass(this.classes.isActive);

            resolve();
        })
    }

    //открытие/закрытие accordion-list
    openCloseAccordion (index) {
        $(this.accordionListElements[index]).toggleClass(this.classes.isActive);

        $(this.accordionIconElements[index]).toggleClass(this.classes.isActive);

        //если закрываем блок, то скрываем блоки marks
        if (!$(this.accordionIconElements[index]).hasClass(this.classes.isActive)) {
            this.closeAllMarksBlock();
        }
    }

    //открытие блока marks
    openMarksBlock (index) {
        //ищем старый открытый marks блок
        let oldMarksBlock = this.accordionElements.find(`${this.selectors.accordionMarks}.${this.classes.isActive}`);

        this.closeAllMarksBlock();

        //если мы кликнули по той же самой ячейке, что и в прошлый раз, то закрываем marks блок
        if (oldMarksBlock[0] !== this.accordionMarksElements[index]) {
            $(this.accordionMarksElements[index]).addClass(this.classes.isActive);
        }
    }

    //закрытие всех блоков marks
    closeAllMarksBlock () {
        this.accordionMarksElements.each((id, elem) => {
            $(elem).removeClass(this.classes.isActive);
        })
    }

    //клик по элементу mark
    clickToMark (index, value) {
        //ищем какому по счету студенту принадлежит клик
        let id = Math.floor(index/15);

        //ищем какой ячейке по счету принадлежит блок marks
        let col = Math.floor(index / 3);

        //ищем какой ячейке в нужной строке принадлежит блок marks
        let realCol = col;
        if (col > 5) {
            realCol = col - (id * 5);
        }

        this.setMark(value, col, realCol, Classes.activeClasses[id]);
    }

    //проставление mark в ячейку, где value - значение проставленного mark, item - объект classes, col - индекс ячейки по порядку с самого начала, realCol - индекс ячейки в нужной строке
    setMark = async (value, col, realCol, item) => {
        //присваиваем текущее состояние classes переменной, чтобы в случае ошибки можно было сделать откат данных
        this.oldClasses = item;

        //получаем предмет на который кликнули
        let lesson = this.getLesson(realCol);

        //проверяем, кликнули ли мы на тот же mark, которы уже был в ячейке
        let check = this.checkMark(item, lesson, value);

        //обновляем данные выбранного classes в зависимости от того: кликнули ли мы на тот же самый mark или нет
        if (check) {
            item[lesson] = '';
        } else {
            item[lesson] = value;
        }

        //проверяем, существует ли этот день
        let checkDay = await new Days().getDate(0, 1, [Days.activeDay.day, Days.activeDay.month, Days.activeDay.year]);

        //проверяем, существует ли этот студент
        let checkStudent = await new Students().checkAStudent(item.student_id);

        if (checkDay.data.length && !checkStudent) {
            $(this.accordionItemElements[col]).find('span').text(item[lesson]);

            await this.redactClasses(item);
        } else {
            await setAlert('Студент/день был удален/изменен.. Страница будет перезагружена!!');
            location.reload();
        }
    }

    //если что-то пошло не так и надо вернуть значение classes как было
    returnClasses () {
        //откатываем данные в classes
        Classes.activeClasses = Classes.activeClasses.map(i => {
            if (i.user_id === this.oldClasses.user_id
                && i.group_id === this.oldClasses.group_id
                && i.student_id === this.oldClasses.student_id
                && i.date_info === this.oldClasses.date_info) {
                return this.oldClasses;
            }
            return i;
        })
    }

    //получение информации о том, на какой предмет кликнули
    getLesson (col) {
        let lessons = ['first_lesson', 'second_lesson', 'third_lesson', 'fourth_lesson', 'fifth_lesson'];

        return lessons[col];
    }

    //проверка: кликнули ли на тот же самый mark
    checkMark (item, lesson, value) {
        return value === item[lesson];
    }
    //==============================================================//
}