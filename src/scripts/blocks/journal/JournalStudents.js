import {getCoordinates} from "../../utils/useCoordinates.js";
import {pxToRem} from "../../utils/usePxToRem.js";
import {input} from "../../utils/useInput.js";
import {redactValidation} from "../../globals/useValidationRedact.js";

import Students from "../../globals/store/useStudents.js";

export default class JournalStudents {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-students]',
        close: '[data-js-students-close]',
        list: '[data-js-students-list]',
        item: '[data-js-students-item]',
        btnBar: '[data-js-students-btn-bar]',
        createOpen: '[data-js-students-create-btn-open]',
        open: '[data-js-students-open]',

        create: '[data-js-students-create]',
        createName: '[data-js-students-create-name]',
        createNameCounter: '[data-js-students-create-name-counter]',
        createSecondName: '[data-js-students-create-second-name]',
        createSecondNameCounter: '[data-js-students-create-second-name-counter]',
        createSurname: '[data-js-students-create-surname]',
        createSurnameCounter: '[data-js-students-create-surname-counter]',
        createBtn: 'data-js-students-create-btn',
        createLoading: '[data-js-students-create-loading]',
        createClose: '[data-js-students-create-close]',
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

        this.studentsElement = $(this.selectors.root);

        this.closeBtn = this.studentsElement.find(this.selectors.close);
        this.studentsListElement = this.studentsElement.find(this.selectors.list);
        this.createOpenBtn = this.studentsElement.find(this.selectors.createOpen);
        this.openBtn = $(this.selectors.open);
        this.createElement = this.studentsElement.find(this.selectors.create);
        this.createNameElement = this.studentsElement.find(this.selectors.createName);
        this.createNameCounterElement = this.studentsElement.find(this.selectors.createNameCounter);
        this.createSecondNameElement = this.studentsElement.find(this.selectors.createSecondName);
        this.createSecondNameCounterElement = this.studentsElement.find(this.selectors.createSecondNameCounter);
        this.createSurnameElement = this.studentsElement.find(this.selectors.createSurname);
        this.createSurnameCounterElement = this.studentsElement.find(this.selectors.createSurnameCounter);
        this.createBtn = this.studentsElement.find(this.selectors.create);
        this.createLoadingElement = this.studentsElement.find(this.selectors.createLoading);
        this.createCloseBtn = this.studentsElement.find(this.selectors.createClose);

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //создаем список студентов, когда обновилась информация
        $(document).on('journalLoad', () => {
            this.createStudentsList();

            //получаем элементы списка студентов
            this.studentsItemElements = this.studentsElement.find(this.selectors.item);
            //получаем элементы btn-bar
            this.btnBarElements = this.studentsElement.find(this.selectors.btnBar);

            //при клике по элементу списка студентов
            this.studentsItemElements.each((index, element) => {
                $(element).on('click', () => {
                    this.openBtnBar(index);
                })
            })
        })

        //очищаем поля ввода и counter-ы
        this.clearCreateBlock();
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке закрытия блока
        this.closeBtn.on('click', this.closeStudentBlock.bind(this));

        //клик по кнопке открытия блока
        this.openBtn.on('click', () => {
            this.openStudentBlock(this.openBtn[0]);
        })

        //при клике по кнопке "Добавить студента"
        this.createOpenBtn.on('click', () => {
            this.openCreateBlock(this.createOpenBtn[0]);
        })

        //при клике по кнопке закрытия блока добавления студента
        this.createCloseBtn.on('click', this.closeCreateBlock.bind(this));

        //ввод в input блока создания студента name
        this.createNameElement.on('input', (event) => {
            input(event, this.createNameCounterElement);

            redactValidation(event, ['', '', '']);
        })

        //ввод в input блока создания студента second_name
        this.createSecondNameElement.on('input', (event) => {
            input(event, this.createSecondNameCounterElement);

            redactValidation(event, ['', '', '']);
        })

        //ввод в input блока создания студента surname
        this.createSurnameElement.on('input', (event) => {
            input(event, this.createSurnameCounterElement);

            redactValidation(event, ['', '', '']);
        })
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//

    //==============================================================//


    //==============================================================//
    //---функции--//
    //открытие блока студентов
    openStudentBlock (btn) {
        this.studentsElement.addClass(this.classes.isActive);

        //получаем координаты кнопки
        this.coordinates = getCoordinates(btn);

        //меняем transform-origin у блока студентов в зависимости от координат кнопки
        this.studentsElement.css({
            transformOrigin: `${pxToRem(this.coordinates.left) + 1.5}rem ${pxToRem(this.coordinates.top) + 1.5}rem`
        })

        this.studentsElement.animate({
            scale: 1
        }, 150, function () {
            $(this).css('border-radius', '0');
        })
    }

    //закрытие блока студентов
    closeStudentBlock () {
        this.studentsElement.animate({
            scale: 0
        }, 150, () => {
            this.studentsElement.removeClass(this.classes.isActive);
        });
    }

    //создание списка студентов
    createStudentsList () {
        //создаем элемент li
        let li = Students.students.map(student => {
            return `
                <li class="journal__students-item list__item" data-js-students-item>
                <p class="slice-string h4">${student.second_name} ${student.name}</p>
                <div class="journal__students-btn-bar list__btn-bar" data-js-students-btn-bar>
                  <button class="list-btn"
                          type="button"
                          aria-label="Редактировать студента"
                          title="Редактировать студента"
                          data-js-students-redact-btn
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000"/>
                    </svg>
                  </button>
                  <button class="list-btn"
                          type="button"
                          aria-label="Удалить студента"
                          title="Удалить студента"
                          data-js-students-delete-btn
                  >
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

        //встраиваем li в ul
        this.studentsListElement.html(li);
    }

    //открытие блока btn-bar
    openBtnBar (index) {
        $(this.btnBarElements[index]).toggleClass(this.classes.isActive);
    }

    //открытие блока создания студента
    openCreateBlock (btn) {
        this.createElement.addClass(this.classes.isActive);

        //получаем координаты кнопки
        this.coordinates = getCoordinates(btn);

        //меняем transform-origin у блока студентов в зависимости от координат кнопки
        this.createElement.css({
            transformOrigin: `${pxToRem(this.coordinates.left) + 8}rem ${pxToRem(this.coordinates.top) + 1.5}rem`
        })

        this.createElement.animate({
            scale: 1
        }, 150, function () {
            $(this).css('border-radius', '0');
        })
    }

    //закрытие блока создания студента
    closeCreateBlock() {
        this.createElement.animate({
            scale: 0
        }, 150, () => {
            this.createElement.removeClass(this.classes.isActive);
        });

        //очищаем поля ввода и counter-ы
        this.clearCreateBlock();
    }

    //очищаем поля ввода и counter-ы в блоке добавления нового студента
    clearCreateBlock () {
        this.createNameElement.val('');
        this.createSecondNameElement.val('');
        this.createSurnameElement.val('');

        this.createNameCounterElement.text(0);
        this.createSecondNameCounterElement.text(0);
        this.createSurnameCounterElement.text(0);
    }
    //==============================================================//
}