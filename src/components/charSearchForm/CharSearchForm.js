import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charSearchForm.scss';

const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const { getCharacterByName, clearError, process, setProcess } = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const errorMessage = process === 'error' ? <div className="error"><ErrorMessage /></div> : null;
    const result = !char ? null : char.length > 0 ?
        <div className="char__wrapper">
            <div className="char__message char__message_success">There is! Visit {char[0].name} page?</div>
            <Link to={`/characters/${char[0].id}`} className='button button__secondary'>
                <div className='inner'>To page</div>
            </Link>
        </div> :
        <div className="char__message char__message_error">
            The character was not found. Check the name and try again
        </div>

    return (
        <div className="char__search">
            <Formik
                initialValues={{ charName: '' }}
                validationSchema={yup.object({
                    charName: yup.string().required('This field is required')
                })}
                onSubmit={({ charName }) => {
                    updateChar(charName)
                }}
            >
                <Form className='char__form'>
                    <label className='char__title' htmlFor='charName'>Or find a character by name:</label>
                    <div className="char__wrapper">
                        <Field
                            className='char__field'
                            placeholder='Enter name'
                            type="text"
                            id="charName"
                            name="charName" />
                        <button
                            type="submit"
                            className='button button__main'
                            disabled={process === 'loading'}>
                            <div className='inner'>FIND</div>
                        </button>
                    </div>
                    <FormikErrorMessage className="char__message char__message_error" name="charName" component="div" />
                </Form>
            </Formik>
            {errorMessage}
            {result}
        </div>
    )
}

export default CharSearchForm;