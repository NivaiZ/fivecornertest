const burgerMenuHandler = () => {
  const burgerButton = document.querySelector(".header-block__burger");
  const contentMenu = document.querySelector('.header-block__content');
  const bodyClass = document.querySelector('.page-body');
  const closeBurgerMenu = document.querySelector('.header-block__button');

  burgerButton.addEventListener('click', () => {
    burgerButton.classList.toggle('header-block__burger--open');
    contentMenu.classList.toggle('header-block__content--open');
    bodyClass.classList.toggle('page-body__noscroll');
  })

  document.addEventListener('click', (e) => {
    const target = e.target
    if (!target.closest('.header-block__content') && !target.closest('.header-block__burger')) {
      contentMenu.classList.remove('header-block__content--open');
      burgerButton.classList.remove('header-block__burger--open');
      bodyClass.classList.remove('page-body__noscroll');
    }
  })

  document.addEventListener("keydown", (evt) => {
    if (evt.keyCode === 27) {
      if (contentMenu.classList.contains('header-block__content--open')) {
        evt.preventDefault();
        contentMenu.classList.remove('header-block__content--open');
        burgerButton.classList.remove('header-block__burger--open');
        bodyClass.classList.remove('page-body__noscroll');
      }
    }
  });

  closeBurgerMenu.addEventListener('click', () => {
    contentMenu.classList.remove('header-block__content--open');
    burgerButton.classList.remove('header-block__burger--open');
    bodyClass.classList.remove('page-body__noscroll');
  })

}

export { burgerMenuHandler };
