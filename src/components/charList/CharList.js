import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMassage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';



class CharList extends Component {
    
    state = {
        chars: [],
        loading: true,
        error: false,
        offset: 210,
        charEnded: false
      }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onLoadChars();
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    onScroll = () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && !this.state.loading) {
            this.onChangeChars();
        }
    }

    onCharLoaded = (chars) => {
        let ended = false;
        if (chars.length < 9) {
            ended = true;
        }
        this.setState( state => ({
            chars: [...state.chars, ...chars],
            loading: false,
            charEnded: ended}))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onChangeChars = () => {
        new Promise(resolve => 
            this.setState(({offset}) => ({
                offset: offset < 1549 ? offset + 9 : 210
            }), resolve)
        ).then(this.onLoadChars)
    }

    onLoadChars = () => {
        this.onCharLoading()
        this.marvelService.getAllCharacters(this.state.offset)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    updateChars(arr) {
        const items = arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render () {
        const {chars, loading, error, charEnded} = this.state;

        const items = this.updateChars(chars);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !error ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {content}
                {spinner}
                <button className="button button__main button__long"
                        onClick={this.onChangeChars}
                        disabled={loading}
                        style={{'display' : charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}



export default CharList;