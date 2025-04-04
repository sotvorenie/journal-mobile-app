const classes = {
    isActive: 'is-active'
}

//показ/скрытие анимации загрузки внутри кнопки
//передаем btn - элемент кнопки, loading - элемент loading-блока,
function setLoading(btn, loading) {
    //показываем/скрываем анимацию внутри кнопки
    btn.toggleClass(classes.isActive);
    loading.toggleClass(classes.isActive);

    //добавляем/убираем disabled у кнопки
    btn.attr('disabled', !btn.attr('disabled'));
}

export {setLoading}