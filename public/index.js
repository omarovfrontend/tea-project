// Добавление поста
console.log('adidas');
const { addPost } = document.forms;
const myPosts = document.querySelector('.myPosts');
const inp = document.querySelector('.location');

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
  const x = inp.value;

  // START MAP
  ymaps.ready(() => {
    init(x);
  });
  const mp = document.getElementsByClassName('ymaps-2-1-79-map');
  if (mp.length > 1) mp[0].remove();

  const placemarks = [
    // {
    //   coordinates: [23.5974172, 119.8962412],
    // },
  ];

  // Получение координат
  function getCoords(res) {
    const firstGeoObject = res.geoObjects.get(0);
    const coords = firstGeoObject.geometry.getCoordinates();
    placemarks.push(({ coordinates: [coords[0], coords[1]] }));
  }

  async function init(txt) {
    // Создание карты
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

    const newCoords = await ymaps.geocode(txt, {
      results: 1,
    });

    await getCoords(newCoords);

    for (let i = 0; i < placemarks.length; i += 1) {
      myMap.geoObjects.add(new ymaps.Placemark(placemarks[i].coordinates));
    }
  }
  // END MAP

  const {
    postName, location, img, description,
  } = addPost;

  const response = await fetch('/post/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postName: postName.value,
      location: location.value,
      img: img.value,
      description: description.value,
      // coordinates: getCoords(location.value)
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
    const response = await fetch(`/post/delete/${event.target.id}`, {
      method: 'delete',
    });
    if (response.ok) {
      const targetDiv = event.target.closest('.myPost');
      targetDiv.remove();
    }
  }
});
