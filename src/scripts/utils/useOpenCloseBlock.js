import {pxToRem} from "./usePxToRem.js";
import {getCoordinates} from "./useCoordinates.js";

const classes = {
    isActive: 'is-active',
    isLock: 'is-lock'
}

function openBlock (block, btn) {
    block.addClass(classes.isActive);

    //получаем координаты кнопки
    let coordinates = getCoordinates(btn);

    //узнаем ширину и высоту кнопки, чтобы анимация воспроизводилась от ее центра
    let btnWidth = $(btn).width();
    let btnHeight = $(btn).height();

    //меняем transform-origin у блока студентов в зависимости от координат кнопки
    block.css({
        transformOrigin: `${pxToRem(coordinates.left + (btnWidth / 2))}rem ${pxToRem(coordinates.top + (btnHeight / 2))}rem`
    })

    $('body').addClass(classes.isLock);

    block.animate({
        scale: 1,
        opacity: 1
    }, 150, function () {
        $(this).css('border-radius', '0');
    })
}

async function closeBlock (block) {
    return new Promise((resolve) => {
        block.animate({
            scale: 0,
            opacity: 0
        }, 150, () => {
            block.removeClass(classes.isActive);
            $('body').removeClass(classes.isLock);
            resolve();
        });
    })
}

export {openBlock, closeBlock};