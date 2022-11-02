// telefon mask
const iMaskHandler = () => {
  const phoneMask = IMask(
    document.getElementById('phone'), {
    mask: '+{7}(000)000-00-00'
  });
}
export {iMaskHandler};
