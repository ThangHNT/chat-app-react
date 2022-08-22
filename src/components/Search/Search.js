import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './Search.module.scss';
import Input from '~/components/Input';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');

    const debounce = useDebounce(searchValue, 800);

    useEffect(() => {
        if (!debounce.trim()) return;

        console.log(debounce);
    }, [debounce]);

    const handleType = useCallback((e) => {
        const valueInput = e.target.value;
        if (!valueInput.startsWith(' ')) {
            setSearchValue(valueInput);
        }
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Input
                type="text"
                noLabel
                onInput={handleType}
                arounded
                placeholder="Tìm kiếm bạn bè"
                input
                name="search"
                autoComplete="off"
            />
        </div>
    );
}

export default Search;
