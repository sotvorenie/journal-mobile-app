import {setAlert} from "../../utils/useInfoMessage.js";
import {getCoordinates} from "../../utils/useCoordinates.js";
import {pxToRem} from "../../utils/usePxToRem.js";
import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";

import {updateClasses} from "../../../api/classes.js";

import Classes from "../../globals/store/useClasses.js";
import Students from "../../globals/store/useStudents.js";
import Days from "../../globals/store/useDays.js";
import Lessons from "../../globals/store/useLessons.js";

export default class JournalTable{
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        verticalJournal: '[data-js-journal-vertical]',
        verticalJournalList: '[data-js-journal-table-list]',

        lessons: '[data-js-journal-lesson]',
        lessonsContainer: '[data-js-journal-lessons-container]',
        lessonInfo: '[data-js-journal-lesson-info]',
        lessonInfoClose: '[data-js-journal-lesson-info-close]',
        lessonInfoText: '[data-js-journal-lesson-info-text]',

        accordion: '[data-js-journal-accordion]',
        accordionBtn: '[data-js-journal-accordion-btn]',
        accordionList: '[data-js-journal-accordion-list]',
        accordionItem: '[data-js-journal-accordion-item]',
        accordionMarks: '[data-js-journal-accordion-marks-list]',
        accordionMarksItem: '[data-js-journal-accordion-marks-item]',

        horizontalJournal: '[data-js-journal-table]',
        tableLesson: '[data-js-journal-table-lesson]',
        tableMain: '[data-js-journal-table-main]',
        tableLoadingContainer: '[data-js-journal-table-loading-container]',
        tableLoading: '[data-js-journal-table-loading]',
        tableNull: '[data-js-journal-table-null-list]',
        tableFooter: '[data-js-journal-table-footer]',
        tableMark: '[data-js-journal-table-mark]',
        tableAbsolute: '[data-js-journal-table-absolute]',
        tableAbsoluteItem: '[data-js-journal-table-absolute-item]'
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
        this.verticalJournalListElement = $(this.selectors.verticalJournalList);
        this.horizontalJournalElement = $(this.selectors.horizontalJournal);
        this.tableMainElement = this.horizontalJournalElement.find(this.selectors.tableMain);
        this.tableLoadingElement = this.horizontalJournalElement.find(this.selectors.tableLoading);
        this.tableLoadingContainerElement = this.horizontalJournalElement.find(this.selectors.tableLoadingContainer);
        this.tableNullElement = this.horizontalJournalElement.find(this.selectors.tableNull);
        this.tableFooterElement = this.horizontalJournalElement.find(this.selectors.tableFooter);
        this.lessonsElements = $(this.selectors.lessons);
        this.lessonsContainerElement = $(this.selectors.lessonsContainer);
        this.lessonInfoElement = $(this.selectors.lessonInfo);
        this.lessonInfoCloseBtn = $(this.selectors.lessonInfoClose);
        this.lessonInfoTextElement = $(this.selectors.lessonInfoText);

        //переменная, хранящая старое состояние classes, чтобы в случаем ошибки можно было откатиться до этого состояния
        this.oldClasses = {};

        this.loadFunctions();

        //задаем стиль таблицы в зависимости от ориентации устройства
        this.changeOrientation();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //при событии, когда мы получили classes журнала
        $(document).on('journalLoad', async () => {
            await this.reloadTables();

            this.bindEvents();
        })

        //при событии удаления студента
        $(document).on('deleteStudent', async () => {
            await this.reloadTables();

            this.bindEvents();
        })
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //при изменении ориентации устройства
        window.addEventListener('resize', () => {
            this.changeOrientation();

            //чтобы если у нас открыт блок информации о предмете - он закрывался
            closeBlock(this.lessonInfoElement);
        });

        //при клике на accordion-btn
        this.accordionBtnElements.each((index, element) => {
            $(element).on('click', (event) => {
                this.openCloseAccordion(index);

                event.stopPropagation();
            })
        })

        //при клике на элемент ячейки журнала в вертикальном журнале
        this.accordionItemElements.each((index, element) => {
            $(element).on('click', (event) => {
                this.openMarksBlock(index);

                event.stopPropagation();
            })
        })

        //при клике на элемент mark в вертикальном журнале
        this.accordionMarksItemElements.each((index, element) => {
            $(element).on('click', () => {
                this.clickToMark(index, $(element).text());
            })
        })

        //клик по элементу lesson в вертикальном журнале
        this.tableLessonElements.each((index, element) => {
            $(element).on('click', () => {
                if (Lessons.activeLessons[index]) {
                    this.openLessonInfo(index, element);
                }
            })
        })

        //клик по ячейке горизонтального журнала
        this.tableMarkElements.each((index, element) => {
            $(element).on('click', () => {
                this.openMarksBlockHorizontal(index)
            })
        })

        //при клике на элемент mark горизонтального журнала
        this.tableAbsoluteItemElement.each((index, element) => {
            $(element).on('click', () => {
                this.clickToMark(index, $(element).text());
            })
        })

        //клик по элементу lessons горизонтального журнала
        this.lessonsElements.each((index, element) => {
            $(element).on('click', () => {
                if (Lessons.activeLessons[index]) {
                    this.openLessonInfo(index, element);
                }
            });
        })

        //клик по кнопке закрытия блока lessonInfo
        this.lessonInfoCloseBtn.on('click', () => {
            closeBlock(this.lessonInfoElement);
        });
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
    //обновление данных журналов
    reloadTables = async () => {
        //показываем список предметов вертикального журнала, если журнал не пуст
        if (Classes.activeClasses.length) {
            this.lessonsContainerElement.addClass(this.classes.isActive);
        }

        //скрываем анимацию загрузки, и если нужно - показываем null-block в горизонтальном журнале
        this.tableLoadingElement.removeClass(this.classes.isActive);
        this.tableLoadingContainerElement.removeClass(this.classes.isActive);
        this.setNullBlock();

        //создаем вертикальный журнал
        await this.createVerticalJournal();

        //получаем элементы accordion
        this.accordionElements = $(this.selectors.accordion);
        this.accordionBtnElements = this.accordionElements.find(this.selectors.accordionBtn);
        this.accordionListElements = this.accordionElements.find(this.selectors.accordionList);
        this.accordionItemElements = this.accordionElements.find(this.selectors.accordionItem);
        this.accordionMarksElements = this.accordionElements.find(this.selectors.accordionMarks);
        this.accordionMarksItemElements = this.accordionElements.find(this.selectors.accordionMarksItem);

        //создаем горизонтальный журнал
        await this.createHorizontalJournal();

        //получаем элементы горизонтального журнала
        this.tableLessonElements = this.horizontalJournalElement.find(this.selectors.tableLesson);
        this.tableMarkElements = this.horizontalJournalElement.find(this.selectors.tableMark);
        this.tableAbsoluteElement = this.horizontalJournalElement.find(this.selectors.tableAbsolute);
        this.tableAbsoluteItemElement = this.horizontalJournalElement.find(this.selectors.tableAbsoluteItem);
    }

    //открытие блока информации о предмете
    openLessonInfo (index, element) {
        //задаем название предмета в блок
        this.lessonInfoTextElement.text(Lessons.activeLessons[index].name);

        openBlock(this.lessonInfoElement, element);
    }

    //создание списка журнала в вертикальном положении
    createVerticalJournal = async () => {
        return new Promise((resolve) => {
            //создаем элементы li
            let accordionItem = Classes.activeClasses.map((item, index) => {
                let student = Students.students.find(i => i.id === item.student_id);

                return `
                <li class="journal__item accordion" data-js-journal-accordion>
                    <div class="accordion__student">
                      <p class="slice-string h4">${student.second_name} ${student.name}</p>
                      <button class="accordion__btn" data-js-journal-accordion-btn>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="#0F0F0F"/>
                        </svg>
                      </button>
                    </div>
                    
                    <ul class="accordion__list" data-js-journal-accordion-list>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].first_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].second_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].third_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].fourth_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${Classes.activeClasses[index].fifth_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
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
            this.verticalJournalListElement.html(accordionItem);

            this.verticalJournalListElement.addClass(this.classes.isActive);

            resolve();
        })
    }

    //открытие/закрытие accordion-list
    openCloseAccordion (index) {
        $(this.accordionListElements[index]).toggleClass(this.classes.isActive);

        $(this.accordionBtnElements[index]).toggleClass(this.classes.isActive);

        //если закрываем блок, то скрываем блоки marks
        if (!$(this.accordionBtnElements[index]).hasClass(this.classes.isActive)) {
            this.closeAllMarksBlock();
        }
    }

    //открытие блока marks в вертикальном журнале
    openMarksBlock (index) {
        //ищем старый открытый marks блок
        let oldMarksBlock = this.accordionElements.find(`${this.selectors.accordionMarks}.${this.classes.isActive}`);

        this.closeAllMarksBlock();

        //если мы кликнули по той же самой ячейке, что и в прошлый раз, то закрываем marks блок
        if (oldMarksBlock[0] !== this.accordionMarksElements[index]) {
            $(this.accordionMarksElements[index]).addClass(this.classes.isActive);
        }
    }

    //закрытие всех блоков marks в вертикальном журнале
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
            //меняем значение в ячейке вертикального журнала
            $(this.accordionItemElements[col]).find('span').text(item[lesson]);

            //меняем значение в ячейке горизонтального журнала
            $(this.tableMarkElements[col]).find('span').text(item[lesson]);

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

    //в зависимости от ориентации устройства - отображаем разные таблицы
    changeOrientation () {
        if (window.innerWidth < window.innerHeight) {
            this.verticalJournalElement.addClass(this.classes.isActive);
            this.horizontalJournalElement.removeClass(this.classes.isActive);

        } else {
            this.verticalJournalElement.removeClass(this.classes.isActive);
            this.horizontalJournalElement.addClass(this.classes.isActive);
        }
    }

    //создание журнала в горизонтальном положении
    createHorizontalJournal = async () => {
        return new Promise((resolve) => {
            //создаем элемент tr
            let trList = Classes.activeClasses.map((item, index) => {
                let student = Students.students.find(i => i.id === item.student_id);

                return `
                    <tr class="table__footer-row">
                      <th class="table__footer-student slice-string">${student.second_name} ${student.name}</th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${Classes.activeClasses[index].first_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${Classes.activeClasses[index].second_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${Classes.activeClasses[index].third_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${Classes.activeClasses[index].fourth_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${Classes.activeClasses[index].fifth_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                    </tr>
                `
            }).join('');

            //встраиваем tr в tfoot
            this.tableFooterElement.html(trList);

            this.tableFooterElement.addClass(this.classes.isActive);

            resolve();
        })
    }

    //открытие блока marks в горизонтальном журнале
    openMarksBlockHorizontal (index) {
        //ищем старый открытый marks блок
        let oldMarksBlock = this.tableFooterElement.find(`${this.selectors.tableAbsolute}.${this.classes.isActive}`);

        this.closeAllMarksBlockHorizontal();

        //если мы кликнули по той же самой ячейке, что и в прошлый раз, то закрываем marks блок
        if (oldMarksBlock[0] !== this.tableAbsoluteElement[index]) {
            $(this.tableAbsoluteElement[index]).addClass(this.classes.isActive);
        }
    }

    //закрытие всех блоков marks в горизонтальном журнале
    closeAllMarksBlockHorizontal () {
        this.tableAbsoluteElement.each((id, elem) => {
            $(elem).removeClass(this.classes.isActive);
        })
    }

    //скрываем анимацию загрузки, и если нужно - показываем null-block в горизонтальном журнале
    setNullBlock() {
        if (!Classes.activeClasses.length) {
            this.tableNullElement.addClass(this.classes.isActive);
        } else {
            this.tableNullElement.removeClass(this.classes.isActive);
            this.tableMainElement.removeClass(this.classes.isActive);
        }
    }
    //==============================================================//
}