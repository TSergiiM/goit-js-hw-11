import axios from 'axios';

export default async function fetchPixabay(userInput, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '25371642-f176f31923c7990a059799838';
  const PARAMETRES = `key=${KEY}&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(`${BASE_URL}?${PARAMETRES}`).then(response => response.data);
}
