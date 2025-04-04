function getCoordinates (btn) {
    let params = btn.getBoundingClientRect();

    let top = params.top;
    let left = params.left;

    return {
        top,
        left
    }
}

export {getCoordinates}