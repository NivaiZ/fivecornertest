function init() {
  var myPlacemark,
    myMap = new ymaps.Map('form-map', {
      center: [55.753994, 37.622093],
      zoom: 9
    }, {
      searchControlProvider: 'yandex#search'
    });

  // Слушаем клик на карте.
  myMap.events.add('click', function (e) {
    var coords = e.get('coords');

    // Если метка уже создана – просто передвигаем ее.
    if (myPlacemark) {
      myPlacemark.geometry.setCoordinates(coords);
    }
    // Если нет – создаем.
    else {
      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      // Слушаем событие окончания перетаскивания на метке.
      myPlacemark.events.add('dragend', function () {
        getAddress(myPlacemark.geometry.getCoordinates());
      });
    }
    getAddress(coords);
  });

  // Создание метки.
  function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {
      iconCaption: 'поиск...'
    }, {
      preset: 'islands#violetDotIconWithCaption',
      draggable: true
    });
  }

  // Определяем адрес по координатам (обратное геокодирование).
  function getAddress(coords) {
    myPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);

      myPlacemark.properties
        .set({
          // Формируем строку с данными об объекте.
          iconCaption: [
            // Название населенного пункта или вышестоящее административно-территориальное образование.
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
          ].filter(Boolean).join(', '),
          // В качестве контента балуна задаем строку с адресом объекта.
          balloonContent: firstGeoObject.getAddressLine()
        });
    });
  }
  const getPlaceBySuggestView = (siggestViewGuessValue) => {
    ymaps.geocode(siggestViewGuessValue).then(res => {
      const firstGeoObject = res.geoObjects.get(0);
      const coords = firstGeoObject.geometry.getCoordinates();

      const bounds = firstGeoObject.properties.get('boundedBy');
      myMap.setBounds(bounds, {
        checkZoomRange: true
      });

      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      getAddress(myPlacemark.geometry.getCoordinates());

    }, error => {
      console.log(error)
    });
  }


  const suggestView = new ymaps.SuggestView('search');
  const suggestViewMobile = new ymaps.SuggestView('search__mobile');

  suggestView.events.add('select', (e) => {
    const chosenAddress = e.get('item').value;
    getPlaceBySuggestView(chosenAddress);
  });

  suggestViewMobile.events.add('select', (e) => {
    const chosenAddress = e.get('item').value;
    getPlaceBySuggestView(chosenAddress);
  });
}

ymaps.ready(init);

// telefon mask
let phoneMask = IMask(
  document.getElementById('phone'), {
  mask: '+{7}(000)000-00-00'

});

// select dropdown
const element = document.querySelector('.form-order__select');
const choices = new Choices(element, {
  searchEnabled: false,
  itemSelectText: '',
});


const orderForm = document.querySelector('#form-basket');

function retrieveFormValue() {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const values = Object.fromEntries(formData.entries());
  alert('Данные отправлены');
  console.log('Данные корзины', values);
}

orderForm.addEventListener('submit', retrieveFormValue)

//burger-menu

const clickBurgerMenuFunction = () => {
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

// search

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


//onblur

const inputMobile = document.querySelector('#email');

inputMobile.onblur = function () {
  if (!this.value.includes('@')) {
    inputMobile.focus();
  }
};

clickBurgerMenuFunction();
