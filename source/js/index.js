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
  //Отображение метки(балуна на карте)
  myGeoObject = new ymaps.GeoObject({
    // Описание геометрии.
    geometry: {
      type: "Point",
      coordinates: [60.033081, 30.428086]
    },
    // Свойства.
    properties: {
      // Контент метки.
      iconCaption: 'Проспект Просвещения, 99',

    }
  }, {
    // Опции.
    // Иконка метки будет растягиваться под размер ее содержимого.
    preset: 'islands#greenDotIconWithCaption',
    // Метку можно перемещать.
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

      // Область видимости геообъекта.
      const bounds = firstGeoObject.properties.get('boundedBy');

      // Масштабируем карту на область видимости геообъекта.
      myMap.setBounds(bounds, {
        checkZoomRange: true
      });

      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      getAddress(myPlacemark.geometry.getCoordinates());

    }, error => {
      // Обработка ошибки
      console.log(error)
    });
  }


  const suggestView = new ymaps.SuggestView('search');

  suggestView.events.add('select', (e) => {
    const chosenAddress = e.get('item').value;
    getPlaceBySuggestView(chosenAddress);
  });

  //end init
}

//end win on load
ymaps.ready(init);
