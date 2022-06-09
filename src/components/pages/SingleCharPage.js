import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react/cjs/react.development';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMassage';
import './singleCharPage.scss';

const SingleCharPage = () => {
    const {charName} = useParams();
    const [char, setChar] = useState(null)
    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    useEffect (() => {
        updateCharForm(charName);
    }, [charName])

    const updateCharForm = (name) => {
        clearError();

        getCharacterByName(name)
            .then(setChar)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View data={char[0]}/> : null;
    console.log(char);
    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail} = data;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={name} className="single-comic__char-img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
            </div>
        </div>
    )
}

export default SingleCharPage;