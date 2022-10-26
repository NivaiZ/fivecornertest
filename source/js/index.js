function init() {
  var myPlacemark;

  var myMap = new ymaps.Map('form-map', {
    center: [60.033081, 30.428086],
    zoom: 16,
    controls: ['zoomControl', 'geolocationControl', 'fullscreenControl']
  });
  myMap.behaviors.disable('scrollZoom');

  myMap.events.add('click', function (e) {
    var coords = e.get('coords');
    if (myPlacemark) {
      myPlacemark.geometry.setCoordinates(coords);
    } else {
      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      myPlacemark.events.add('dragend', function () {
        getAddress(myPlacemark.geometry.getCoordinates());
      });
    }
    getAddress(coords);
  });

  myGeoObject = new ymaps.GeoObject({
    geometry: {
      type: "Point",
      coordinates: [60.033081, 30.428086]
    },

    properties: {
      iconCaption: 'Проспект Просвещения, 99',

    }
  }, {
    preset: 'islands#greenDotIconWithCaption',
  }),
    myPieChart = new ymaps.Placemark([
      60.033081, 30.428086
    ]);

  myMap.geoObjects
    .add(myGeoObject)

  function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {
      iconCaption: 'Уже ищу...'
    }, {
      preset: 'islands#violetDotIconWithCaption',
      draggable: true
    });
  }

  function getAddress(coords) {
    myPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);

      myPlacemark.properties
        .set({
          iconCaption: [
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
          ].filter(Boolean).join(', '),
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

  suggestView.events.add('select', (e) => {
    const chosenAddress = e.get('item').value;
    getPlaceBySuggestView(chosenAddress);
  });

}

ymaps.ready(init);

// telefon mask
var phoneMask = IMask(
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
  const bodyClass = document.querySelector('.page-body')

  burgerButton.addEventListener('click', () => {
    burgerButton.classList.toggle('header-block__burger--open');
    contentMenu.classList.toggle('header-block__content--open');
    bodyClass.classList.toggle('page-body__noscroll');
  })

  window.addEventListener('click', e => {
    const target = e.target
    if (!target.closest('.header-block__content') && !target.closest('.header-block__burger')) {
      contentMenu.classList.remove('header-block__content--open');
      burgerButton.classList.remove('header-block__burger--open');
      bodyClass.classList.remove('page-body__noscroll');
    }
  })

  window.addEventListener("keydown", (evt) => {
    if (evt.keyCode === 27) {
      if (contentMenu.classList.contains('header-block__content--open')) {
        evt.preventDefault();
        contentMenu.classList.remove('header-block__content--open');
        burgerButton.classList.remove('header-block__burger--open');
        bodyClass.classList.remove('page-body__noscroll');
      }
    }
  });

}

// search

const searchButton = document.querySelector('.search-header__item');
const inputSearch = document.querySelector('.search-header__enter');
const addClassOverlay = document.querySelector('.search-header__modal');
const buttonSubmit = document.querySelector('.search-header__burger');


searchButton.addEventListener('click', (e) => {
  inputSearch.focus();
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

clickBurgerMenuFunction();
