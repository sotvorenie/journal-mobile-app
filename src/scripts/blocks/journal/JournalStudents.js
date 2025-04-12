import {input} from "../../utils/useInput.js";
import {redactValidation} from "../../utils/useValidationRedact.js";
import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {setMessage} from "../../utils/useMessage.js";
import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";

import {createNewStudent, removeStudent, updateStudent} from "../../../api/students.js";

import Students from "../../globals/store/useStudents.js";
import User from "../../globals/store/useUser.js";
import Groups from "../../globals/store/useGroups.js";
import Classes from "../../globals/store/useClasses.js";

export default class JournalStudents {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-students]',
        close: '[data-js-students-close]',
        list: '[data-js-students-list]',
        item: '[data-js-students-item]',
        btnBar: '[data-js-students-btn-bar]',
        open: '[data-js-students-open]',
        delete: '[data-js-students-delete-btn]',

        create: '[data-js-students-create]',
        createName: '[data-js-students-create-name]',
        createNameCounter: '[data-js-students-create-name-counter]',
        createSecondName: '[data-js-students-create-second-name]',
        createSecondNameCounter: '[data-js-students-create-second-name-counter]',
        createSurname: '[data-js-students-create-surname]',
        createSurnameCounter: '[data-js-students-create-surname-counter]',
        createBtn: '[data-js-students-create-btn]',
        createLoading: '[data-js-students-create-loading]',
        createClose: '[data-js-students-create-close]',
        createOpen: '[data-js-students-create-btn-open]',

        redact: '[data-js-students-redact]',
        redactName: '[data-js-students-redact-name]',
        redactNameCounter: '[data-js-students-redact-name-counter]',
        redactSecondName: '[data-js-students-redact-second-name]',
        redactSecondNameCounter: '[data-js-students-redact-second-name-counter]',
        redactSurname: '[data-js-students-redact-surname]',
        redactSurnameCounter: '[data-js-students-redact-surname-counter]',
        redactBtn: '[data-js-students-redact-btn]',
        redactLoading: '[data-js-students-redact-loading]',
        redactClose: '[data-js-students-redact-close]',
        redactOpen: '[data-js-students-redact-open]',
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

        this.studentsElement = $(this.selectors.root);

        this.closeBtn = this.studentsElement.find(this.selectors.close);
        this.studentsListElement = this.studentsElement.find(this.selectors.list);
        this.openBtn = $(this.selectors.open);

        this.createElement = this.studentsElement.find(this.selectors.create);
        this.createNameElement = this.studentsElement.find(this.selectors.createName);
        this.createNameCounterElement = this.studentsElement.find(this.selectors.createNameCounter);
        this.createSecondNameElement = this.studentsElement.find(this.selectors.createSecondName);
        this.createSecondNameCounterElement = this.studentsElement.find(this.selectors.createSecondNameCounter);
        this.createSurnameElement = this.studentsElement.find(this.selectors.createSurname);
        this.createSurnameCounterElement = this.studentsElement.find(this.selectors.createSurnameCounter);
        this.createBtn = this.studentsElement.find(this.selectors.createBtn);
        this.createLoadingElement = this.studentsElement.find(this.selectors.createLoading);
        this.createCloseBtn = this.studentsElement.find(this.selectors.createClose);
        this.createOpenBtn = this.studentsElement.find(this.selectors.createOpen);

        this.redactElement = this.studentsElement.find(this.selectors.redact);
        this.redactNameElement = this.studentsElement.find(this.selectors.redactName);
        this.redactNameCounterElement = this.studentsElement.find(this.selectors.redactNameCounter);
        this.redactSecondNameElement = this.studentsElement.find(this.selectors.redactSecondName);
        this.redactSecondNameCounterElement = this.studentsElement.find(this.selectors.redactSecondNameCounter);
        this.redactSurnameElement = this.studentsElement.find(this.selectors.redactSurname);
        this.redactSurnameCounterElement = this.studentsElement.find(this.selectors.redactSurnameCounter);
        this.redactBtn = this.studentsElement.find(this.selectors.redactBtn);
        this.redactLoadingElement = this.studentsElement.find(this.selectors.redactLoading);
        this.redactCloseBtn = this.studentsElement.find(this.selectors.redactClose);

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //создаем список студентов, когда обновилась информация
        $(document).on('journalLoad', this.getListElements.bind(this));

        //очищаем информацию в блоке добавления студента
        this.clearCreateBlock();
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке закрытия блока
        this.closeBtn.on('click', () => {
            closeBlock(this.studentsElement);

            //закрываем все btn-bars
            this.closeAllBtnBars();
        });

        //клик по кнопке открытия блока
        this.openBtn.on('click', () => {
            openBlock(this.studentsElement, this.openBtn[0])
        })

        //при клике по кнопке "Добавить студента"
        this.createOpenBtn.on('click', () => {
            openBlock(this.createElement, this.createOpenBtn[0]);
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

        //клик по кнопке "Создать студента"
        this.createBtn.on('click', this.clickToCreate.bind(this));

        //клик по кнопке закрытия блока редактирования студента
        this.redactCloseBtn.on('click', () => {
            closeBlock(this.redactElement);
        })

        //ввод в input блока редактирования студента name
        this.redactNameElement.on('input', (event) => {
            input(event, this.redactNameCounterElement);

            redactValidation(event, [Students.activeStudent.name, Students.activeStudent.second_name, Students.activeStudent.surname]);
        })

        //ввод в input блока редактирования студента second_name
        this.redactSecondNameElement.on('input', (event) => {
            input(event, this.redactSecondNameCounterElement);

            redactValidation(event, [Students.activeStudent.name, Students.activeStudent.second_name, Students.activeStudent.surname]);
        })

        //ввод в input блока редактирования студента surname
        this.redactSurnameElement.on('input', (event) => {
            input(event, this.redactSurnameCounterElement);

            redactValidation(event, [Students.activeStudent.name, Students.activeStudent.second_name, Students.activeStudent.surname]);
        })

        //клик по кнопке "Редактировать"
        this.redactBtn.on('click', this.clickToRedact.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //создание студента
    createStudent = async () => {
        try {
            //показываем анимацию загрузки внутри кнопки "Добавить"
            setLoading(this.createBtn, this.createLoadingElement);

            //корректируем данные в полях ввода
            let [name, secondName, surname] = this.correctData(this.createNameElement.val(), this.createSecondNameElement.val(), this.createSurnameElement.val());

            //проверяем на дублирование ФИО
            let check = this.checkDoubleFIO(name, secondName, surname);

            //проверка, что такого же студента на сервере нет
            let check2 = await this.students.checkAStudent('', name, secondName, surname);

            if (check && check2) {
                let data = {
                    user_id: User.activeUser.id,
                    group_id: Groups.activeGroup.id,
                    name,
                    second_name: secondName,
                    surname
                }

                const response = await createNewStudent(data);

                if (response.status === 200) {
                    await this.students.getStudents();

                    //перерисовываем список студентов и получаем элементы списка студентов
                    this.getListElements();

                    this.closeCreateBlock();

                    setMessage('Студент добавлен!!');
                } else {
                    await setAlert('Что-то пошло не так..');
                }
            } else {
                await setAlert('Такой студент уже существует!!');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //скрываем анимацию загрузки внутри кнопки "Добавить"
            setLoading(this.createBtn, this.createLoadingElement);
        }
    }

    //удаление студента
    deleteStudent = async (id) => {
        try {
            let data = {
                params: {
                    user_id: User.activeUser.id,
                    group_id: Groups.activeGroup.id,
                    id
                }
            }

            const response = await removeStudent(data);

            if (response.status === 200) {
                //удаляем студента из списка групп
                Students.students = Students.students.filter(student => student.id !== id);

                //перерисовываем список студентов и получаем элементы списка студентов
                this.getListElements();

                //проверяем: есть ли удаленный студент в activeClasses
                let checkStudentInClasses = Classes.activeClasses.some(item => item.student_id === id)
                if (checkStudentInClasses) {
                    //редактируем активный classes, чтобы удалить из него удаленного студента
                    Classes.activeClasses = Classes.activeClasses.filter(classes => classes.student_id !== id);

                    //создаем событие для перерисовки журналов
                    $(document).trigger('updateStudent');
                }

                setMessage('Студент удален!!');
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //редактировать студента
    redactStudent = async () => {
        try {
            //показываем анимацию загрузки внутри кнопки "Редактировать"
            setLoading(this.redactBtn, this.redactLoadingElement);

            //корректируем данные в полях ввода
            let [name, secondName, surname] = this.correctData(this.redactNameElement.val(), this.redactSecondNameElement.val(), this.redactSurnameElement.val());

            //проверка на дублирование ФИО
            let check = this.checkDoubleFIO(name, secondName, surname);

            //проверка, что такого же студента нет на сервере
            let check2 = await this.students.checkAStudent('', name, secondName, surname);

            if (check && check2) {
                let data = {
                    user_id: User.activeUser.id,
                    group_id: Groups.activeGroup.id,
                    id: Students.activeStudent.id,
                    name,
                    second_name: secondName,
                    surname
                }

                const response = await updateStudent(data);

                if (response.status === 200) {
                    //заменяем данные о студенте
                    Students.students = Students.students.map(student => {
                        if (student.id === Students.activeStudent.id) {
                            return {
                                ...student,
                                name,
                                second_name: secondName,
                                surname
                            }
                        }

                        return student;
                    })

                    //перерисовываем список студентов и получаем элементы списка студентов
                    this.getListElements();

                    closeBlock(this.redactElement);

                    //проверяем: есть ли редактируемый студент в activeClasses
                    let checkStudentInClasses = Classes.activeClasses.some(item => item.student_id === Students.activeStudent.id)
                    if (checkStudentInClasses) {
                        //создаем событие для перерисовки журналов
                        $(document).trigger('updateStudent');
                    }

                    setMessage('Студент редактирован!!');
                } else {
                    await setAlert('Что-то пошло не так..');
                }
            } else {
                await setAlert('Такой студент уже существует!!');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //скрываем анимацию загрузки внутри кнопки "Редактировать"
            setLoading(this.redactBtn, this.redactLoadingElement);
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //получение элементов из созданного списка студентов
    getListElements () {
        this.createStudentsList();

        //получаем элементы списка студентов
        this.studentsItemElements = this.studentsElement.find(this.selectors.item);
        //получаем элементы btn-bar
        this.btnBarElements = this.studentsElement.find(this.selectors.btnBar);
        //получаем кнопки для удаления студентов
        this.deleteBtns = this.studentsElement.find(this.selectors.delete);
        //получаем кнопки открытия блока редактирования
        this.redactOpenBtns = this.studentsElement.find(this.selectors.redactOpen);

        //при клике по элементу списка студентов
        this.studentsItemElements.each((index, element) => {
            $(element).on('click', () => {
                this.openBtnBar(index);
            })
        })

        //при клике по кнопке "Удалить студента"
        this.deleteBtns.each((index, btn) => {
            $(btn).on('click', (event) => {
                this.clickToDelete(Students.students[index].id);

                event.stopPropagation();
            })
        })

        //при клике по кнопке открытия блока редактирования студента
        this.redactOpenBtns.each((index, btn) => {
            $(btn).on('click', (event) => {
                this.openRedactBlock(index, btn);

                event.stopPropagation();
            })
        })
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
                          data-js-students-redact-open
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

    //закрытие блока создания студента
    closeCreateBlock = async () => {
        await closeBlock(this.createElement)

        //очищаем поля ввода и counter-ы
        this.clearCreateBlock();
    }

    //очищаем поля ввода и counter-ы в блоке добавления нового студента, а также делаем кнопку "Добавить" disabled
    clearCreateBlock () {
        this.createNameElement.val('');
        this.createSecondNameElement.val('');
        this.createSurnameElement.val('');

        this.createNameCounterElement.text(0);
        this.createSecondNameCounterElement.text(0);
        this.createSurnameCounterElement.text(0);

        this.createBtn.attr('disabled', true);
    }

    //при клике по кнопке "Добавить"
    clickToCreate = async () => {
        let confirmed = await setConfirm('Вы действительно хотите добавить студента?');

        if (confirmed) {
            this.createStudent();
        }
    }

    //проверка, чтобы не было студента с таким же ФИО (при создании и редактировании студентов)
    checkDoubleFIO (name, secondName, surname) {
        if (!Students.students.length) {
            return true;
        }

        return !Students.students.some(student => {
            return student.name === name
                && student.second_name === secondName
                && student.surname === surname
        })
    }

    //убираем пробелы, цифры из полей ввода при отправке на сервер, а также делаем первые буквы заглавными, а остальные буквы строчными
    correctData = (...input) => {
        //убираем пробелы
        input = input.map(i => i.replace(/\s+/g, ''));

        //убираем цифры
        input = input.map(i => i.replace(/\d+/g, ''));

        //делаем первые буквы заглавными
        input = input.map(i => i.slice(0, 1).toUpperCase() + i.slice(1).toLowerCase());

        return input;
    }

    //клик по кнопке "Удалить студента"
    clickToDelete = async (id) => {
        let confirmed = await setConfirm('Вы действительно хотите удалить студента?');

        if (confirmed) {
            this.deleteStudent(id);
        }
    }

    //открытие блока редактирования студента
    openRedactBlock (index, btn) {
        Students.activeStudent = Students.students[index];

        //заполняем поля ввода информацией о редактируемом студенте
        this.redactNameElement.val(Students.activeStudent.name);
        this.redactSecondNameElement.val(Students.activeStudent.second_name);
        this.redactSurnameElement.val(Students.activeStudent.surname);

        //заполняем counter-ы информацией
        this.redactNameCounterElement.text(Students.activeStudent.name.length);
        this.redactSecondNameCounterElement.text(Students.activeStudent.second_name.length);
        this.redactSurnameCounterElement.text(Students.activeStudent.surname.length);

        openBlock(this.redactElement, btn);
    }

    //закрытие всех btn-bars
    closeAllBtnBars () {
        this.btnBarElements?.each((index, element) => {
            $(element).removeClass(this.classes.isActive)
        })
    }

    //клик по кнопке "Редактировать студента"
    clickToRedact = async () => {
        let confirmed = await setConfirm('Вы действительно хотите редактировать студента?');

        if (confirmed) {
            this.redactStudent();
        }
    }
    //==============================================================//
}