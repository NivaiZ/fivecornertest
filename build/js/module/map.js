const mapHandler = () => {
  document.addEventListener('DOMContentLoaded', () => {
    function init() {
      var myInput = document.getElementById('search'),
        myInputMobile = document.getElementById('search__mobile'),
        myPlacemark, coords,
        myMap = new ymaps.Map('form-map', {
          center: [55.753994, 37.622093],
          zoom: 9
        }, {
          searchControlProvider: 'yandex#search'
        });

      // Слушаем клик на карте.
      myMap.events.add('click', function (e) {
        coords = e.get('coords');
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
          var firstGeoObject = res.geoObjects.get(0),
            address = firstGeoObject.getAddressLine();

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
              balloonContent: address
            });
          myInput.value = address;
          myInputMobile.value = address;
        });
      }

      const getPlaceBySuggestView = (siggestViewGuessValue) => {
        ymaps.geocode(siggestViewGuessValue).then(res => {
          const firstGeoObject = res.geoObjects.get(0);
          coords = firstGeoObject.geometry.getCoordinates();

          const bounds = firstGeoObject.properties.get('boundedBy');
          myMap.setBounds(bounds, {
            checkZoomRange: true
          });

          if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
          }
          else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            getAddress(myPlacemark.geometry.getCoordinates());
          }
        }, error => {
          console.log(error)
        });
      }

      const suggestViewMobile = new ymaps.SuggestView('search__mobile');
      const suggestView = new ymaps.SuggestView('search__mobile');

      suggestViewMobile.events.add('select', (e) => {
        const chosenAddress = e.get('item').value;
        getPlaceBySuggestView(chosenAddress);
      });

      suggestView.events.add('select', (e) => {
        const chosenAddress = e.get('item').value;
        getPlaceBySuggestView(chosenAddress);
      });

    }
    ymaps.ready(init);
  })
}
export {mapHandler};
