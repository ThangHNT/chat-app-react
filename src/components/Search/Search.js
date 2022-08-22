import { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import styles from './Search.module.scss';
import Input from '~/components/Input';
import { useDebounce } from '~/hooks';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const inputRef = useRef();
    const debounce = useDebounce(searchValue, 800);

    useEffect(() => {
        if (!debounce.trim()) return;
        axios
            .get(`${host}/api/search`, { params: { q: debounce } })
            .then((data) => {
                console.log(data.data.listUser);
                const data2 = data.data;
                if (data2.status) {
                    setSearchResults(data.data.listUser);
                    setShowResults(true);
                } else {
                    alert(data2.msg);
                }
            })
            .catch((err) => {
                console.log('loi tim nguoi dung');
            });
        // console.log(debounce);
    }, [debounce]);

    const handleType = useCallback((e) => {
        const valueInput = e.target.value;
        if (!valueInput.startsWith(' ')) {
            setSearchValue(valueInput);
        } else {
            setSearchValue('');
            inputRef.current.value = '';
        }
    }, []);

    const handleHideResults = () => {
        setShowResults(false);
    };

    return (
        <div className={cx('wrapper')}>
            <Tippy
                interactive
                placement="bottom"
                visible={searchResults.length > 0 && showResults}
                render={(attrs) => (
                    <div className="box" tabIndex="-1" {...attrs}>
                        My tippy box
                    </div>
                )}
                onClickOutside={handleHideResults}
            >
                <div className={cx('wrapper-input')}>
                    <Input
                        ref={inputRef}
                        type="text"
                        noLabel
                        onInput={handleType}
                        arounded
                        placeholder="Tìm kiếm bạn bè"
                        input
                        name="search"
                        autoComplete="off"
                        onFocus={() => {
                            console.log('focus');
                            setShowResults(true);
                        }}
                    />
                </div>
            </Tippy>
        </div>
    );
}

export default Search;
