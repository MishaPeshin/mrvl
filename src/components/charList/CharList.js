import { useState, useEffect, useRef, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, Component, newItemsLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return newItemsLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const { getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    // useEffect(() => { // отрабатывает некорректно
    //     window.addEventListener('scroll', onLoadByScroll);

    //     return () => {
    //         window.removeEventListener('sсroll', onLoadByScroll);
    //     }
    // }, [newItemsLoading]);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = async (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        for (let char of newCharList) {
            await delay(100);
            setCharList(charList => [...charList, char]);
        }
        setNewItemsLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    // const onLoadByScroll = () => {
    //     const docElem = document.documentElement;
    //     if ((docElem.clientHeight + window.scrollY) >= docElem.scrollHeight - 1 && !newItemsLoading && !loading) {
    //         onRequest(offset);
    //     }
    // }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => {
            item.classList.remove('char__item_selected');
        });
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            const { name, thumbnail, id } = item;
            let imgStyle = { 'objectFit': 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (

                <CSSTransition classNames='char__item' key={item.id} timeout={500}>
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el} /* el - это ссылка на dom элемент */
                        key={id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i)
                        }}
                        onKeyUp={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        <img src={thumbnail} alt={name} style={imgStyle} />
                        <div className="char__name">{name}</div>
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

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemsLoading);
    }, [process]);

    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;