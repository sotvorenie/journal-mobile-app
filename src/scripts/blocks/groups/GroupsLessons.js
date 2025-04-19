import User from "../../globals/store/useUser.js";
import UseGroups from "./useGroups.js";

import {getLessons, checkLesson, createNewLesson, removeLesson, redactLessons} from "../../../api/lessons.js";

import {input} from "../../utils/useInput.js";
import {redactValidation} from "../../utils/useValidationRedact.js";
import {setLoading} from "../../utils/useSetLoading.js";
import {setMessage} from "../../utils/useMessage.js";
import {setAlert, setConfirm} from "../../utils/useInfoMessage.js";
import {openBlock, closeBlock} from "../../utils/useOpenCloseBlock.js";
import Lessons from "../../globals/store/useLessons.js";

export default class GroupsLessons {
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-groups-lessons]',
        loading: '[data-js-groups-lessons-loading]',
        nullList: '[data-js-groups-lessons-null-list]',
        listContainer: '[data-js-groups-lessons-list-container]',
        lesson: '[data-js-groups-lessons-item]',
        delete: '[data-js-groups-lessons-delete]',

        createBlock: '[data-js-groups-lessons-create-block]',
        createOpen: '[data-js-groups-lessons-create-open]',
        createInput: '[data-js-groups-lessons-create-input]',
        createCounter: '[data-js-groups-lessons-create-counter]',
        create: '[data-js-groups-lessons-create]',
        createLoading: '[data-js-groups-lessons-create-loading]',
        createClose: '[data-js-groups-lessons-create-close]',

        redactBlock: '[data-js-groups-lessons-redact-block]',
        redactOpen: '[data-js-groups-lessons-redact-open]',
        redactInput: '[data-js-groups-lessons-redact-input]',
        redactCounter: '[data-js-groups-lessons-redact-counter]',
        redact: '[data-js-groups-lessons-redact]',
        redactLoading: '[data-js-groups-lessons-redact-loading]',
        redactClose: '[data-js-groups-lessons-redact-close]',

        info: '[data-js-groups-lessons-info]',
        infoClose: '[data-js-groups-lessons-info-close]',
        infoText: '[data-js-groups-lessons-info-text]'
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
        this.groupsLessonsElement = $(this.selectors.root);

        this.loadingElement = this.groupsLessonsElement.find(this.selectors.loading);
        this.nullListElement = this.groupsLessonsElement.find(this.selectors.nullList);
        this.listContainerElement = this.groupsLessonsElement.find(this.selectors.listContainer);
        this.createElement = this.groupsLessonsElement.find(this.selectors.createBlock);
        this.createOpenBtn = this.groupsLessonsElement.find(this.selectors.createOpen);
        this.createInputElement = this.groupsLessonsElement.find(this.selectors.createInput);
        this.createCounterElement = this.groupsLessonsElement.find(this.selectors.createCounter);
        this.createBtn = this.groupsLessonsElement.find(this.selectors.create);
        this.createLoadingElement = this.groupsLessonsElement.find(this.selectors.createLoading);
        this.createCloseBtn = this.groupsLessonsElement.find(this.selectors.createClose);
        this.infoElement = this.groupsLessonsElement.find(this.selectors.info);
        this.infoCloseBtn = this.groupsLessonsElement.find(this.selectors.infoClose);
        this.infoTextElement = this.groupsLessonsElement.find(this.selectors.infoText);
        this.redactElement = this.groupsLessonsElement.find(this.selectors.redactBlock);
        this.redactInputElement = this.groupsLessonsElement.find(this.selectors.redactInput);
        this.redactCounterElement = this.groupsLessonsElement.find(this.selectors.redactCounter);
        this.redactBtn = this.groupsLessonsElement.find(this.selectors.redact);
        this.redactLoadingElement = this.groupsLessonsElement.find(this.selectors.redactLoading);
        this.redactCloseBtn = this.groupsLessonsElement.find(this.selectors.redactClose);

        //переменная списка предметов
        this.lessons = [];

        //переменная, хранящая id предмета, который мы редактируем
        this.redactLessonID = '';

        //переменная, хранящая название предмета, который мы редактируем
        this.redactLessonName = '';

        //событие, когда открываем блок редактирования группы
        $(document).on('groupsRedactOpen', async () => {
            await this.getLessons();

            this.getBtnElements();
        });

        this.bindEvents();

        this.loadFunctions();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = () => {
        //делаем кнопку "Изменить" disabled
        this.redactBtn.attr('disabled', true);
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //нажатие на кнопку "Добавить предмет", чтобы открыть блок добавления предмета
        this.createOpenBtn.on('click', this.openCreateBlock.bind(this));

        //нажатие на кнопку "Отмена" в блоке добавления нового предмета
        this.createCloseBtn.on('click', () => {
            closeBlock(this.createElement);
        });

        //ввод в input в блоке создания нового предмета
        this.createInputElement.on('input', (event) => {
            input(event, this.createCounterElement);

            redactValidation(event, ['']);
        })

        //клик по кнопке "Добавить предмет"
        this.createBtn.on('click', this.clickToCreate.bind(this));

        //клик по кнопке закрытия блока информации о предмете
        this.infoCloseBtn.on('click', () => {
            closeBlock(this.infoElement);
        });

        //клик по кнопке закрытия блока редактирования предмета
        this.redactCloseBtn.on('click', () => {
             closeBlock(this.redactElement);
        });

        //при вводе в input редактирования предмета
        this.redactInputElement.on('input', (event) => {
            input(event, this.redactCounterElement);

            redactValidation(event, [this.redactLessonName]);
        })

        //клик по кнопке "Редактировать предмет"
        this.redactBtn.on('click', this.clickToRedact.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //получаем список предметов
    getLessons = async () => {
        try {
            //показываем анимацию загрузки
            this.setLoading(false, false, true);

            let data = `?user_id=${User.activeUser.id}&group_id=${UseGroups.activeGroup.id}`;

            const response = await getLessons(data);

            if (response.status === 200) {
                if (response.data.length) {
                    this.lessons = response.data;

                    this.setLessonsList();

                    this.setLoading(false, true, false);
                } else {
                    this.setLoading(true, false, false);
                }
            } else {
                await setAlert('Что-то пошло не так..');
                this.setLoading(false, false, true);
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //создаем новый предмет
    createLesson  = async () => {
        try {
            //показываем анимацию загрузки в кнопке "Добавить предмет"
            setLoading(this.createBtn, this.createLoadingElement);

            //проверяем, чтобы не было предмета с таким же названием
            let check = this.checkDoubleLesson(this.createInputElement.val());

            //проверяем на существование этого же предмета на сервере
            let check2 = await this.checkALesson('', this.createInputElement.val());

            if (check && check2) {
                let data = {
                    user_id: User.activeUser.id,
                    group_id: UseGroups.activeGroup.id,
                    name: this.createInputElement.val()
                }

                const response = await createNewLesson(data);

                if (response.status === 200) {
                    //выводим сообщение
                    setMessage('Предмет добавлен!!');

                    //закрываем блок добавления предмета
                    closeBlock(this.createElement);

                    //получаем список предметов группы
                    await this.getLessons();

                    //получаем кнопки для редактирования и удаления предметов
                    this.getBtnElements();
                } else {
                    await setAlert('Что-то пошло не так..');
                }
            } else {
                await setAlert('Такой предмет уже существует!!');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //скрываем анимацию загрузки в кнопке "Добавить предмет"
            setLoading(this.createBtn, this.createLoadingElement);
        }
    }

    //проверка существования предмета
    checkALesson = async (id = '', name = '') => {
        try {
            let data = `?user_id=${User.activeUser.id}&group_id=${UseGroups.activeGroup.id}&id=${id}&name=${name}`;

            const response = await checkLesson(data);

            if (response.status === 200) {
                return !response.data.length;
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //удалить предмет
    deleteLesson = async (id) => {
        try {
            let data = {
                params: {
                    user_id: User.activeUser.id,
                    group_id: UseGroups.activeGroup.id,
                    id
                }
            }

            const response = await removeLesson(data);

            if (response.status === 200) {
                //удаляем предмет из списка предметов
                this.lessons = this.lessons.filter(lesson => lesson.id !== id);

                //если предметы еще есть - перерисовываем список предметов, иначе выводим null-list блок
                if (this.lessons.length) {
                    //обновляем список предметов
                    this.setLessonsList();

                    //получаем кнопки для редактирования и удаления предметов
                    this.getBtnElements();
                } else {
                    this.setLoading(true, false, false);
                }

                //выводим сообщение
                setMessage('Предмет удален!!');
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }

    //редактировать предмет
    redactLesson = async () => {
        try {
            //показываем анимацию загрузки в кнопке "Редактировать предмет"
            setLoading(this.redactBtn, this.redactLoadingElement);

            //проверяем на дублирование имени предмета
            let check = this.checkDoubleLesson(this.redactInputElement.val());

            //проверяем на существование этого же предмета на сервере
            let check2 = await this.checkALesson('', this.redactInputElement.val());

            if (check && check2) {
                let data = {
                    user_id: User.activeUser.id,
                    group_id: UseGroups.activeGroup.id,
                    id: this.redactLessonID,
                    name: this.redactInputElement.val()
                }

                const response = await redactLessons(data);

                if (response.status === 200) {
                    //обновляем данные в списке предметов
                    this.lessons = this.lessons.map(lesson => {
                        if (lesson.id === this.redactLessonID) {
                            return {
                                ...lesson,
                                name: data.name
                            }
                        }
                        return lesson;
                    })

                    //выводим сообщение
                    setMessage('Предмет изменен!!');

                    //обновляем список предметов
                    this.setLessonsList();

                    //получаем кнопки для редактирования и удаления предметов
                    this.getBtnElements();

                    //закрываем блок редактирования предмета
                    closeBlock(this.redactElement);
                } else {
                    await setAlert('Что-то пошло не так..');
                }
            } else {
                await setAlert('Такой предмет уже существует!!');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        } finally {
            //скрываем анимацию загрузки в кнопке "Редактировать предмет"
            setLoading(this.redactBtn, this.redactLoadingElement);
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //получаем кнопки для редактирования и удаления предметов
    getBtnElements () {
        //получаем элементы списка предметов
        this.lessonsElements = this.groupsLessonsElement.find(this.selectors.lesson);
        //получаем кнопки для удаления предмета
        this.deleteBtns = this.groupsLessonsElement.find(this.selectors.delete);
        //получаем кнопки для редактирования предмета
        this.redactOpenBtns = this.groupsLessonsElement.find(this.selectors.redactOpen);

        this.lessonsElements.off('click');
        this.deleteBtns.off('click');
        this.redactOpenBtns.off('click');

        //при клике по элементу списка предметов
        this.lessonsElements.each((index, btn) => {
            $(btn).on('click', () => {
                let name = this.lessons[index].name;

                this.openInfoBlock(btn, name);
            });
        })
        //при клике по кнопке удаления предмета
        this.deleteBtns.each((index, btn) => {
            $(btn).on('click', (event) => {
                let id = this.lessons[index].id;

                this.clickToDelete(id);

                event.stopPropagation();
            });
        })
        //при клике по кнопке редактирования предмета
        this.redactOpenBtns.each((index, btn) => {
            $(btn).on('click', (event) => {
                this.redactLessonName = this.lessons[index].name;

                //делаем кнопку "Изменить" disabled
                this.redactBtn.attr('disabled', true);

                this.openRedactBlock(this.redactLessonName, index);

                event.stopPropagation();
            });
        })
    }

    //скрываем блок пустого списка и блок списка и показываем анимацию загрузки
    setLoading (nullVal, listVal, loadVal) {
        if (nullVal) {
            this.nullListElement.addClass(this.classes.isActive);
        } else {
            this.nullListElement.removeClass(this.classes.isActive);
        }

        if (listVal) {
            this.listContainerElement.addClass(this.classes.isActive);
        } else {
            this.listContainerElement.removeClass(this.classes.isActive);
        }

        if (loadVal) {
            this.loadingElement.addClass(this.classes.isActive);
        } else {
            this.loadingElement.removeClass(this.classes.isActive);
        }
    }

    //добавляем список предметов на страницу
    setLessonsList () {
        //создаем элементы li
        let lessonsListItem = this.lessons.map(lesson => {
            return `
                    <li class="groups-lessons__item list__item list__item--small" data-js-groups-lessons-item>
                        <p class="slice-string h4">${lesson.name}</p>
                        <div class="list__btn-bar">
                            <button class="list-btn"
                                    type="button"
                                    aria-label="Редактировать предмет"
                                    title="Редактировать предмет"
                                    data-js-groups-lessons-redact-open
                            >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000"/>
                                </svg>
                            </button>
                            <button class="list-btn"
                                    type="button"
                                    aria-label="Удалить предмет"
                                    title="Удалить предмет"
                                    data-js-groups-lessons-delete
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

        //создаем ul для списка предметов
        let ul = $(`<ul class="groups-lessons__list list list--padding"></ul>`);

        //встраиваем li в ul
        ul.html(lessonsListItem);

        //встраиваем ul в контейнер списка групп
        this.listContainerElement.html(ul);
    }

    //открытие блока добавления нового предмета
    openCreateBlock () {
        //очистка поля ввода
        this.createInputElement.val('');

        //задаем counter = 0
        this.createCounterElement.text(0);

        openBlock(this.createElement, this.createOpenBtn[0]);
    }

    //при клике по кнопке "Создать предмет"
    clickToCreate = async () => {
        let confirmed = await setConfirm('Вы действительно хотите создать предмет?');

        if (confirmed) {
            this.createLesson();
        }
    }

    //проверка, чтобы не было предмета с таким же названием
    checkDoubleLesson (name) {
        if (!this.lessons.length) {
            return true;
        }
        return !this.lessons.some(lesson => lesson.name === name);
    }

    //открытие блока информации о предмете
    openInfoBlock (element, name) {
        //заполняем информацию о предмете
        this.infoTextElement.text(name)

        openBlock(this.infoElement, element);
    }

    //клик по кнопке удаления предмета
    clickToDelete = async (id) => {
        let confirmed = await setConfirm('Вы действительно хотите удалить предмет?');

        if (confirmed) {
            this.deleteLesson(id);
        }
    }

    //открытие блока редактирования предмета
    openRedactBlock (name, index) {
        //задаем id редактируемого предмета переменной
        this.redactLessonID = this.lessons[index].id;

        //очистка поля ввода
        this.redactInputElement.val(name);

        //задаем counter = длине названия предмета
        this.redactCounterElement.text(this.redactInputElement.val().length);

        openBlock(this.redactElement, this.redactOpenBtns[index])
    }

    //клик по кнопке "Редактировать предмет"
    clickToRedact = async  () => {
        let confirmed = await setConfirm('Вы действительно хотите редактировать предмет?');

        if (confirmed) {
            this.redactLesson();
        }
    }
    //==============================================================//
}