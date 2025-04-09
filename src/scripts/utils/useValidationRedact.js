const elements = {
    form: '[data-js-form]',
    redactBtn: '[data-js-redact-btn]',
}

//oldData - старые данные, которые были в полях ввода до редактирования
//event - DOM-элемент поля ввода
export function redactValidation(event, oldData) {
    let {target} = event;

    //проверяем, что кликнули по input
    let validity = checkInputType(target);

    if (validity) {
        //получаем родителя поля ввода
        let parentElement = target.closest(elements?.form);

        //получаем кнопку "Редактировать"
        let redactBtnElement = parentElement.querySelector(elements?.redactBtn);

        //получаем все поля ввода
        let inputElements = parentElement.querySelectorAll('input');

        //проверяем, чтобы в полях ввода не содержалось старой информации
        //если вся информация старая - делаем кнопку типа disabled
        let doubleValidity = checkDoubleInfo(oldData, inputElements);

        //проверяем, чтобы все поля были заполнены
        let nullValueValidity = checkValue(inputElements);

        redactBtnElement.disabled = !nullValueValidity || doubleValidity;
    }
}

//функция проверки, что элемент - input, а не что-то иное
function checkInputType(target) {
    return target.tagName === 'INPUT';
}

//функция проверки, что старые значения в полях ввода не совпадают с новыми
function checkDoubleInfo(oldData, inputs) {
    let oldValidateCounter = 0;
    let inputsNumber = inputs.length;

    //подсчитываем в скольких полях ввода введенные данные совпадают со старыми данными
    inputs.forEach((input, key) => {
        if (input.value === oldData[key]) {
            oldValidateCounter++;
        }
    });

    //если во всех полях ввода старые данные - возвращаем false, иначе - true
    return oldValidateCounter === inputsNumber;
}

//функция проверки, чтобы все поля были заполнены
function checkValue(inputs) {
    let values = [];
    inputs.forEach(input => values.push(input.value));
    return values.every(value => value.length);
}