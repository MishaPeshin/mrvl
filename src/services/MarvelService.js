class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // лодаш означает что изменять эту переменную нельзя
    _apiKey = 'apikey=074a837690f9cea45462fd649d4b3bcb';

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }
}

export default MarvelService;