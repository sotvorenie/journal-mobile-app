
const selectors = {
    alert: '[data-js-alert]',
    alertText: '[data-js-alert-text]',
    alertBtn: '[data-js-alert-btn]',

    confirm: '[data-js-confirm]',
    confirmText: '[data-js-confirm-text]',
    confirmBtnNo: '[data-js-confirm-btn-no]',
    confirmBtnYes: '[data-js-confirm-btn-yes]'
}

const classes = {
    isActive: 'is-active'
}

async function setAlert(text = '') {
    return new Promise((resolve) => {
        let alert = $(selectors.alert);
        let alertText = alert.find(selectors.alertText);
        let alertBtn = alert.find(selectors.alertBtn);

        alertText.text(text);

        alert.addClass(classes.isActive);

        alert.animate({
            opacity: 1
        }, 100)

        alertBtn.on('click', () => {
            alert.animate({
                opacity: 0
            }, 100, () => {
                alert.removeClass(classes.isActive);
            })

            resolve()
        })
    })
}

async function setConfirm(text = '') {
    return new Promise((resolve) => {
        let confirm = $(selectors.confirm);
        let confirmText = confirm.find(selectors.confirmText);
        let confirmBtnNo = confirm.find(selectors.confirmBtnNo);
        let confirmBtnYes = confirm.find(selectors.confirmBtnYes);

        confirmText.text(text);

        confirm.addClass(classes.isActive);

        confirm.animate({
            opacity: 1
        }, 100)

        function close() {
            confirm.animate({
                opacity: 0
            }, 100, function ()  {
                confirm.removeClass(classes.isActive);
            })
        }

        confirmBtnNo.on('click', () => {
            close();
            resolve(false);
        });

        confirmBtnYes.on('click', () => {
            close();
            resolve(true);
        })
    })
}

export {setAlert, setConfirm}