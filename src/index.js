const BASE_URL = 'http://localhost:3000/posts';
let currentPostId = null; // Tracks which post is selected

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';

      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id); // Auto-show first post
      }
    });
}

function handlePostClick(postId) {
  fetch(`${BASE_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;

      const detail = document.getElementById('post-detail');
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <small><strong>Author:</strong> ${post.author}</small><br><br>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById('edit-btn').addEventListener('click', () => {
        document.getElementById('edit-title').value = post.title;
        document.getElementById('edit-content').value = post.content;
        document.getElementById('edit-post-form').classList.remove('hidden');
      });

      document.getElementById('delete-btn').addEventListener('click', () => {
        deletePost(post.id);
      });
    });
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        displayPosts(); // Reload posts
      });
  });
}

function addEditPostListener() {
  const form = document.getElementById('edit-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const updatedPost = {
      title: document.getElementById('edit-title').value,
      content: document.getElementById('edit-content').value
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(() => {
        form.classList.add('hidden');
        displayPosts();
      });
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    form.classList.add('hidden');
  });
}

function deletePost(postId) {
  fetch(`${BASE_URL}/${postId}`, { method: 'DELETE' })
    .then(() => {
      document.getElementById('post-detail').innerHTML = '<p>Post deleted.</p>';
      displayPosts();
    });
}

document.addEventListener('DOMContentLoaded', main);
