export default class Animation {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        //основной блок авторизации
        root: '[data-js-animation]',
        body: '[data-js-animation-body]',
        btn: '[data-js-animation-btn]'
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
        this.animationElement = $(this.selectors.root);
        this.animationBodyElement = this.animationElement.find(this.selectors.body);
        this.animationBtnElement = this.animationElement.find(this.selectors.btn);

        this.animation = true;

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//

    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions() {
        //применяем значение анимаций, которое сейчас в localStorage
        this.animation = (window.localStorage.getItem('animation') === 'true') ?? true;

        //устанавливаем анимации
        this.changeAnimation(this.animation);
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //событие клика по переключателю темы
        this.animationBodyElement.on('click', this.clickToAnimation.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //клик по переключателю
    clickToAnimation () {
        this.animationBtnElement.hasClass(this.classes.isActive) ?
            this.changeAnimation(false) :
            this.changeAnimation(true);
    }

    //функция переключения анимаций
    changeAnimation (animation) {
        jQuery.fx.off = !animation;

        this.setClassToBtn(animation);

        this.setToLocStore(animation);
    }

    //меняем класс у переключателя
    setClassToBtn (animation) {
        animation ?
            this.animationBtnElement.addClass(this.classes.isActive) :
            this.animationBtnElement.removeClass(this.classes.isActive);
    }

    //вносим изменения в localStorage
    setToLocStore (animation) {
        window.localStorage.setItem('animation', animation);
    }
    //==============================================================//
}