import { useState, useEffect, useRef } from 'react';
import React from 'react'
import { CSSTransition, TransitionGroup, } from 'react-transition-group';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMassage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        const onScroll = () => {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && !loading) {
                onChangeChars();
            }
        }
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll);
        return () => { window.removeEventListener('scroll', onScroll); }
    }, [loading])

    useEffect(() => {
          onLoadChars();
    }, [offset])

    const onCharLoaded = (chars) => {
        let ended = false;
        if (chars.length < 9) {
            ended = true;
        }
        setCharList(charList => [...charList, ...chars]);
        setCharEnded(ended)
    }

    const onChangeChars = () => {
        setOffset(offset => offset < 1549 ? offset + 9 : 210)
    }

    const onLoadChars = () => {
        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const listRef = useRef([]);

    const onFocusRef = (index) => {
        listRef.current.forEach((item, i) => {
            if (i === index) {
                item.classList.add('char__item_selected')
            } else {
                item.classList.remove('char__item_selected')
            }
        }) 
    }
    
    function updateChars(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li className="char__item"
                        ref={el => listRef.current[i] = el}
                        key={item.id}
                        tabIndex="0"
                        onFocus={() => {
                                    props.onCharSelected(item.id)
                                    onFocusRef(i)}
                                }>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
                
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const items = updateChars(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !error ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {content}
            {spinner}
            <button className="button button__main button__long"
                    onClick={onChangeChars}
                    disabled={loading}
                    style={{'display' : charEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;