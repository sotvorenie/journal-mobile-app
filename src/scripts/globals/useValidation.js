export default class FormsValidation {
    selectors = {
        form: '[data-js-form]',
        fieldErrors: '[data-js-form-field-errors]'
    }

    errorMessages = {
        valueMissing: () => 'Пожалуйста, заполните это поле',
        patternMismatch: ({ title }) => title || 'Данные не соответствуют формату',
        tooShort: ({ minLength }) => `Минимум символов — ${minLength}`,
        tooLong: ({ maxLength }) => `Максимум символов — ${maxLength}`,
    }

    constructor() {
        this.bindEvents()
    }

    manageErrors(fieldControlElement, errorMessages) {
        const fieldErrorsElement = fieldControlElement.parentElement.querySelector(this.selectors.fieldErrors)

        fieldErrorsElement.innerHTML = errorMessages
            .map((message) => `<span class="field__error">${message}</span>`)
            .join('')
    }

    validateField(fieldControlElement) {
        const errors = fieldControlElement.validity
        const errorMessages = []

        Object.entries(this.errorMessages).forEach(([errorType, getErrorMessage]) => {
            if (errors[errorType]) {
                errorMessages.push(getErrorMessage(fieldControlElement))
            }
        })


        this.manageErrors(fieldControlElement, errorMessages)

        const isValid = errorMessages.length === 0

        fieldControlElement.ariaInvalid = !isValid

        return isValid
    }

    onBlur(event) {
        const { target } = event

        const isFormField = $(target).closest(this.selectors.form)
        const isRequired = target.required

        if (isFormField && isRequired) {
            this.validateField(target)
        }
    }

    onSubmit(event) {
        const isFormElement = $(event).is(this.selectors.form)

        if (!isFormElement) {
            return
        }

        const requiredControlElements = $(event).find(':input').filter(function() {
            return $(this).prop('required');
        });

        let isFormValid = true
        let firstInvalidFieldControl = null

        requiredControlElements.each(function(index, element) {
            const isFieldValid = this.validateField(element);

            if (!isFieldValid) {
                isFormValid = false;

                if (!firstInvalidFieldControl) {
                    firstInvalidFieldControl = element;
                }
            }
        }.bind(this));

        //event.preventDefault()

        if (!isFormValid) {
            firstInvalidFieldControl.focus();

            return false;
        }

        return true;
    }

    bindEvents() {
        document.addEventListener('blur', (event) => {
            this.onBlur(event)
        }, { capture: true })
        //document.addEventListener('submit', (event) => this.onSubmit(event))
    }
}