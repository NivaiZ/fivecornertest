const formDataHandler = () => {
  const orderForm = document.querySelector('#form-basket');

  function retrieveFormValue() {
    event.preventDefault();

    const formData = new FormData(orderForm);
    const values = Object.fromEntries(formData.entries());
    alert('Данные отправлены');
    console.log('Данные корзины', values);
  }

  orderForm.addEventListener('submit', retrieveFormValue)
}
export {formDataHandler};
