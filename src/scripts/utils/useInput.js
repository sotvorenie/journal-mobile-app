export function input (inputElement, counterElement) {
    counterElement.text($(inputElement.target).val().length);
}