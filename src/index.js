import { Notify } from 'notiflix';
import fetchPixabay from './js/fetchPixabay';
import './css/style.css';

const refs = {
  formSearch: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};
refs.formSearch.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', loadMore);
refs.btnLoadMore.classList.add('visually-hidden');

let page = 1;
let perPage = 0;
let userInput = '';

async function onSearch(event) {
  event.preventDefault();
  userInput = event.target.elements.searchQuery.value;
  // console.log(event);
  // console.log(userInput);
  page = 1;
  if (userInput.trim() === '') {
    Notify.failure('Please enter your search data.');
    return;
  }
  const response = await fetchPixabay(userInput, page);
  perPage = response.hits.length;

  if (response.totalHits <= perPage) {
    refs.btnLoadMore.classList.add('visually-hidden');
  } else {
    refs.btnLoadMore.classList.remove('visually-hidden');
  }

  if (response.totalHits === 0) {
    refs.gallery.innerHTML = '';

    Notify.failure('Sorry, there are no images matching your search query. Please try again!');
  }
  try {
    if (response.totalHits > 0) {
      Notify.info(`Hooray! We found ${response.totalHits} images`);
      refs.gallery.innerHTML = '';
      renderCard(response.hits);
    }
  } catch (error) {
    console.log(error);
  }
  refs.formSearch.reset();
}

//----------------функція LoadMore
async function loadMore() {
  try {
    page += 1;
    const response = await fetchPixabay(userInput, page);
    onLoadMoreRenderCard(response.hits);
    perPage += response.hits.length;

    if (perPage >= response.totalHits) {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      refs.btnLoadMore.classList.add('visually-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

//----------------функція рендерить карточку по пошуку
function renderCard(array) {
  const markup = array
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
          <a class='photo-card__item' href='${largeImageURL}'>
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.gallery.innerHTML = markup;
}
//---------------рендерить карточки після нажимання кнорки loadMore
function onLoadMoreRenderCard(array) {
  const markup = array
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
          <a class='photo-card__item' href='${largeImageURL}'>
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
