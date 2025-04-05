import User from "../../globals/store/useUser.js";
import Groups from "../../globals/store/useGroups.js";

import UseGroups from "./useGroups.js";

import {deleteStudentsGroup} from "../../../api/groups.js";
import {setMessage} from "../../utils/useMessage.js";
import {setAlert} from "../../utils/useInfoMessage.js";

export default class GroupsList {
//==============================================================//
    //---DOM-селекторы--//
    selectors = {
        root: '[data-js-groups]',
        item: '[data-js-groups-item]',
        name: '[data-js-groups-name]',
        delete: '[data-js-groups-delete]',
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
        this.useGroups = new UseGroups();

        this.groupsElement = $(this.selectors.root);

        this.nameElement = this.groupsElement.find(this.selectors.name);

        //получаем элементы после того как список групп будет встроен на страницу
        $(document).on('groupsListRendered', () => {
            //получаем кнопки для удаления групп
            this.deleteBtns = this.groupsElement.find(this.selectors.delete);

            //получаем элементы списка групп
            this.groupItems = this.groupsElement.find(this.selectors.item);

            this.bindEvents();
        })

        this.loadFunctions();
    }
    //==============================================================//


    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions = async () => {
        //задаем переменной name название организации пользователя
        this.setUserOrganizationName();

        //получаем список групп
        await this.useGroups.getGroups();
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке "Удалить группу"
        this.deleteBtns.each((index, btn) => {
            $(btn).on('click', (event) => {
                let confirmed = confirm('Вы действительно хотите удалить группу?');

                if (confirmed) {
                    this.delete(index);
                }

                event.stopPropagation();
            })
        })

        //клик по элементу списка групп
        this.groupItems.each((index, element) => {
            $(element).on('click', () => {
                this.clickToGroup(index)
            });
        })
    }
    //==============================================================//


    //==============================================================//
    //---обращения к серверу--//
    //удаляем группу
    delete = async (index) => {
        try {
            let id = UseGroups.groupsList[index].id;

            let data = {
                params: {
                    user_id: User.activeUser.id,
                    id
                }
            }

            const response = await deleteStudentsGroup(data);

            if (response.status === 200) {
                //удаляем группу из списка групп
                UseGroups.groupsList = UseGroups.groupsList.filter(group => group.id !== id);

                //обновляем список групп на странице, если группы есть, или выводим, что групп нет
                if (UseGroups.groupsList.length) {
                    this.useGroups.setUserGroups();
                } else {
                    this.useGroups.setEmptyGroups();
                }

                //выводим сообщение
                setMessage('Группа удалена!!');
            } else {
                await setAlert('Что-то пошло не так..');
            }
        } catch (err) {
            await setAlert('Что-то пошло не так..');
        }
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //задаем переменной name название организации пользователя
    setUserOrganizationName () {
        this.nameElement.text(User.activeUser.organization);
    }

    //при клике по элементу списка групп
    clickToGroup (index) {
        //задаем информацию о группе по которой кликнули - переменной
        Groups.activeGroup = UseGroups.groupsList[index];

        //переходим на страницу журнала
        window.location.href = '../../../../journal.html';
    }
    //==============================================================//
}