const searchModalHandler = () => {
  const searchButton = document.querySelector('.search-header__item');
  const inputSearch = document.querySelector('.search-header__enter');
  const addClassOverlay = document.querySelector('.search-header__modal');
  const buttonSubmit = document.querySelector('.search-header__burger');
  const offsetWidth = document.documentElement.clientWidth;


  searchButton.addEventListener('click', (e) => {
    if (offsetWidth < 1140) {
      inputSearch.focus();
    }

    inputSearch.classList.add('search-header__enter--open');
    addClassOverlay.classList.add('search-header__modal--open');
    buttonSubmit.classList.add('search-header__burger--open');

  })

  searchButton.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
      if (addClassOverlay.classList.contains('search-header__modal--open')) {
        addClassOverlay.classList.remove('search-header__modal--open');
        inputSearch.classList.remove('search-header__enter--open');
        buttonSubmit.classList.remove('search-header__burger--open');
      }
    }
  })

  addClassOverlay.addEventListener('click', (e) => {
    const target = e.target;
    if (!target.closest('.header-block__content') && !target.closest('.header-block__burger')) {
      addClassOverlay.classList.remove('search-header__modal--open');
      inputSearch.classList.remove('search-header__enter--open');
      buttonSubmit.classList.remove('search-header__burger--open');
    }
  })
}
export { searchModalHandler };
