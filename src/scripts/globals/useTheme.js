export default class Theme {
    //==============================================================//
    //---DOM-селекторы--//
    selectors = {
        //основной блок авторизации
        root: '[data-js-theme]',
        body: '[data-js-theme-body]',
        btn: '[data-js-theme-btn]'
    }
    //==============================================================//


    //==============================================================//
    //---классы--//
    classes = {
        isLight: 'is-light',
        isDark: 'is-dark',
    }
    //==============================================================//


    //==============================================================//
    //---переменные--//
    constructor() {
        this.themeElement = $(this.selectors.root);
        this.themeBodyElement = this.themeElement.find(this.selectors.body);
        this.themeBtnElement = this.themeBodyElement.find(this.selectors.btn);

        //значение темы
        this.theme = 'light';

        this.loadFunctions();
        this.bindEvents();
    }
    //==============================================================//

    //==============================================================//
    //---функции, выполняющиеся сразу после загрузки страницы--//
    loadFunctions() {
        //применяем тему, которая сейчас в localStorage
        this.theme = window.localStorage.getItem('theme') ?? 'light';

        //устанавливаем тему
        this.changeTheme(this.theme);
    }
    //==============================================================//


    //==============================================================//
    //---обработчики событий--//
    bindEvents() {
        //событие клика по переключателю темы
        this.themeBodyElement.on('click', this.clickToTheme.bind(this));
    }
    //==============================================================//


    //==============================================================//
    //---функции--//
    //клик по переключателю
    clickToTheme () {
        this.themeBtnElement.hasClass(this.classes.isLight) ?
            this.changeTheme('dark') :
            this.changeTheme('light');
    }

    //функция переключения темы
    changeTheme (theme) {
        theme === 'light' ?
            this.setClassToBtn(this.classes.isDark, this.classes.isLight) :
            this.setClassToBtn(this.classes.isLight, this.classes.isDark);

        this.setClassToBody(theme);

        this.setToLocStore(theme);
    }

    //изменение класса кнопки
    setClassToBtn (deleteClass, setClass) {
        this.themeBtnElement.removeClass(deleteClass);
        this.themeBtnElement.addClass(setClass);
    }

    //изменение класса body
    setClassToBody (theme) {
        theme === 'light' ?
            $(document.body).removeClass(this.classes.isDark) :
            $(document.body).addClass(this.classes.isDark);
    }

    //вносим изменения в localStorage
    setToLocStore (theme) {
        window.localStorage.setItem('theme', theme);
    }
    //==============================================================//
}