const onBlurEmailHandleer = () => {
  const inputMobile = document.querySelector('#email');

  inputMobile.onblur = function () {
    if (!this.value.includes('@')) {
      inputMobile.focus();
    }
  };
}
export { onBlurEmailHandleer };
