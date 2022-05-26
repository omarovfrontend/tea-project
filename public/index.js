// Добавление поста
console.log('dsadas');
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
    }),
  });

  if (response.ok) {
    const result = await response.json();
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
