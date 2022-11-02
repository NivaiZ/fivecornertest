// select dropdown
const selectDropDownHandler = () => {
  const element = document.querySelector('.form-order__select');
  const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: '',
  });
}
export {selectDropDownHandler};
