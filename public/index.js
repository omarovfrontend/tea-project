// START MAP
(() => {
  const placemarks = [
    {
      coordinates: [23.5974172, 119.8962412],
      hintContent: '<div class="map__hint">Teguanin</div>',
      balloonContent: [
        '<div class="map__balloon">',
        '<span>',
        'Some info about tea',
        '</span>',
        '</br>',
        '<a href="#">подробнее..',
        '<a/>',
        '</div>',
      ],
    },
    {
      coordinates: [55.764094, 37.617617],
      hintContent: '<div class="map__hint">Matcha</div>',
      balloonContent: [
        '<div class="map__balloon">',
        '<span>',
        'Some info about tea',
        '</span>',
        '</br>',
        '<a href="#">подробнее..',
        '<a/>',
        '</div>',
      ],
    },
  ];

  async function getCoords(geocode, el) {
    const firstGeoObject = await geocode.geoObjects.get(0);
    const coords = await firstGeoObject.geometry.getCoordinates();
    // ВСТАВИТЬ ПОЛЯ ИЗ РЕСПОНСА FETCH
    placemarks.push({
      coordinates: [coords[0], coords[1]],
      hintContent: `<div class="map__hint">${el.title}</div>`,
      balloonContent: [
        `<div class="map__balloon">
        <span>
        ${el.description}
        </span>
        </br>
        <a href="/create/${el.id}">подробнее..
        <a/>
        </div>`,
      ],
    });
  }

  async function init() {
    // Создание карты.
    const res = await fetch('/get-tea', {
      method: 'get',
    });
    if (res.ok) {
      const data = await res.json();
      // console.log(data);
      // Подается слово для поиска координат

      data.forEach(async (el) => {
        // console.log(el);
        const newCoords = await ymaps.geocode(el.location, {
          results: 1,
        });
        // console.log(newCoords);
        // Функция которая возвращает координиты по слову и записывает обьект для создания МЕТКИ
        // Вызов
        await getCoords(newCoords, el);
      });
    } else {
      console.log('sosi biby');
    }
    setTimeout(() => {
      placemarks.map(async (el) => {
        await myMap.geoObjects.add(
          new ymaps.Placemark(
            el.coordinates,
            {
              hintContent: el.hintContent,
              balloonContent: [el.balloonContent],
            },
            {
              iconLayout: 'default#image',
              iconImageHref: '/images/leaf.png',
            },
          ),
        );
      });
    }, 1000);

    console.log(placemarks.length);
    console.log(placemarks);

    const myMap = new ymaps.Map('myMap', {
      center: [45.366377, 2.397632],
      zoom: 2,
    });

    myMap.controls.remove('geolocationControl');
    myMap.controls.remove('searchControl');
    myMap.controls.remove('trafficControl');
    myMap.controls.remove('typeSelector');
    myMap.controls.remove('fullscreenControl');
    myMap.controls.remove('rulerControl');
    console.log(placemarks);
  }
  ymaps.ready(init);
})();
// END MAP

console.log('adidas');
// Добавление поста
const { addPost } = document.forms;
const myPosts = document.querySelector('.myPosts');

function insertPost(post) {
  return `
    <div class="myPost">
    <p>${post.title}</p>
    <p>${post.location}</p>
    <img src=${post.img} alt="photo">
      <p>${post.description}</p>
      <div data-dataId="${post.id}" class="myPost-inner">
        <button data-type="delete" id="${post.id}" class="myPosts_delete-btn">Удалить</button>
      </div>
    </div>
  `;
}

addPost.addEventListener('submit', async (event) => {
  event.preventDefault();
  const {
    postName, location, img, description,
  } = addPost;

  const response = await fetch('/create/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postName: postName.value,
      location: location.value,
      img: img.value,
      description: description.value,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    console.log(result);
    myPosts.insertAdjacentHTML('afterbegin', insertPost(result));

    postName.value = '';
    location.value = '';
    img.value = '';
    description.value = '';
  }
});

// Удаление поста
myPosts.addEventListener('click', async (event) => {
  event.preventDefault();
  if (event.target.className === 'myPosts_delete-btn') {
    const response = await fetch(`/create/delete/${event.target.id}`, {
      method: 'delete',
    });
    if (response.ok) {
      const targetDiv = event.target.closest('.myPost');
      targetDiv.remove();
    }
  }
});
