import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Input from '~/components/Input';

const cx = classNames.bind(styles);

function Search() {
    return (
        <div className={cx('wrapper')}>
            <Input type="text" noLabel arounded placeholder="Tìm kiếm bạn bè" input name="search" autoComplete="off" />
        </div>
    );
}

export default Search;
