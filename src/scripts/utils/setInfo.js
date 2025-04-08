function setInfo() {
    let hours = new Date().getHours();
    let text = '';

    if (hours < 7 || hours > 20) {
        text = 'Доброй ночи!! ;)';
    } else if (hours >= 7 && hours < 12) {
        text = 'Доброе утро!! ;)';
    } else {
        text = 'Хорошего дня!! ;)';
    }

    console.info(text + ' >> ' + hours + ':' + new Date().getMinutes());
    console.info('Проект создан в качестве дипломной работы студентом СКФ БГТУ им В.Г. Шухова');
    console.info('Использовались технологии: HTML, SCSS, JavaScript, jQuery, Axios, Swiper.js, PHP, mySQL, Vite');
}

export {setInfo};