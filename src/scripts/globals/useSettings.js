import {getCoordinates} from "../utils/useCoordinates.js";
import {pxToRem} from "../utils/usePxToRem.js";

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
        this.settingsOpenBtn.on('click', this.openSettingsBlock.bind(this));

        //клик по кнопке закрытия блока настроек
        this.settingsCloseBtn.on('click', this.closeSettingsBlock.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //открытие/закрытие блока настроек
    openSettingsBlock () {
        //получаем координаты кнопки открытия настроек
        let coordinates = getCoordinates(this.settingsOpenBtn[0]);

        //меняем transform-origin у блока настроек
        this.settingsElement.css({
            transformOrigin: `${pxToRem(coordinates.left) + 1.5}rem ${pxToRem(coordinates.top) + 1.5}rem`
        })

        this.settingsElement.animate({
            opacity: 1,
            scale: 1
        }, 150, function () {
            $(this).css('border-radius', '0');
        })
    }

    //закрытие блока настроек
    closeSettingsBlock () {
        this.settingsElement.animate({
            opacity: 0,
            scale: 0
        }, 150)
    }
    //==============================================================//
}