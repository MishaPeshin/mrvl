import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();


    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // лодаш означает что изменять эту переменную нельзя
    const _apiKey = 'apikey=074a837690f9cea45462fd649d4b3bcb';
    const _baseOffset = 210;


    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    };

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'This character do not have description',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }

    const _transformComics = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description || 'There is no description',
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            price: comic.prices[0].price == 0 ? 'NOT AVAILABLE' : comic.prices[0].price + '$',
            pages: comic.pageCount ? comic.pageCount + ' p.' : 'No information about the number of pages',
            language: comic.textObjects.language || 'en-us',
        }
    }

    return { loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic, getCharacterByName };
}

export default useMarvelService;