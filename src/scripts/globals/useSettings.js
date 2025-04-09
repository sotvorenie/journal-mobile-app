import {openBlock, closeBlock} from "../utils/useOpenCloseBlock.js";

export default class Settings {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        //основной блок авторизации
        settings: '[data-js-settings]',
        open: '[data-js-settings-open]',
        close: '[data-js-settings-close]'
    }
    //==============================================================//


    //==============================================================//
    //---переменные--//
    constructor() {
        this.settingsElement = $(this.selectors.settings);
        this.settingsOpenBtn = $(this.selectors.open);
        this.settingsCloseBtn = $(this.selectors.close);

        this.bindEvents();
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //клик по кнопке открытия блока настроек
        this.settingsOpenBtn.on('click', () => {
            openBlock(this.settingsElement, this.settingsOpenBtn[0]);
        });

        //клик по кнопке закрытия блока настроек
        this.settingsCloseBtn.on('click', () => {
            closeBlock(this.settingsElement)
        });
    }
    //==============================================================//


    //==============================================================//
    //---функции--//

    //==============================================================//
}