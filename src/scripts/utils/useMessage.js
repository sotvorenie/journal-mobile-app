import {pxToRem} from "./usePxToRem.js";

const selectors = {
    message: '[data-js-message]'
}

function setMessage(text = '') {
    let messageElement = $(selectors.message);

    messageElement.text(text);

    messageElement.animate({
        top: `${pxToRem(15)}rem`,
        opacity: 1
    }, 300).delay(2500).animate({
        top: `-100%`,
        opacity: 0
    }, 300);
}

export {setMessage}