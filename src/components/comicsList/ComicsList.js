import { useEffect, useState } from 'react';
import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMassage';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(10);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getComicBooks} = useMarvelService();

    useEffect(() => {
        onLoadChars();
    }, [offset])

    const onComicsLoaded = (comics) => {
        let ended = false;
        if (comics.length < 8) {
            ended = true;
        }
        setComicsList(comicsList => [...comicsList, ...comics])
        setComicsEnded(comicsEnded => ended)
    }

    const onChangeComics = () => {
        setOffset(offset => offset < 52028 ? offset + 8 : 10)
    }

    const onLoadChars = () => {
        getComicBooks(offset)
            .then(onComicsLoaded)
    }

    function updateComics(arr) {

        const items = arr.map((item, i) => {
            return (
                <li className="comics__item"
                key={i}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.name} className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = updateComics(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !error ? items : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {content}
            {spinner}
            <button className="button button__main button__long"
                onClick={onChangeComics}
                disabled={loading}
                style={{'display' : comicsEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;