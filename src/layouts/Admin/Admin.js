import { useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import host from '~/ulties/serverHost';
import styles from './Admin.module.scss';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function Admin() {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
        // eslint-disable-next-line
    }, []);

    const handleDelete = async (e) => {
        const target = e.target;
        const type = target.getAttribute('deletetype');
        // console.log(type);
        const { data } = await axios.post(`${host}/api/check-admin`, { type });
        console.log(data);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('item')}>
                <span onClick={handleDelete} deletetype={cx('delete-all-user')}>
                    Xóa tất cả người dùng
                </span>
            </div>
            <div className={cx('item')}>
                <span onClick={handleDelete} deletetype={cx('delete-all-message')}>
                    Xóa tất cả tin nhắn
                </span>
            </div>
            <div className={cx('item')}>
                <span onClick={handleDelete} deletetype={cx('delete-all-setting')}>
                    Xóa tất cả cài đặt
                </span>
            </div>
        </div>
    );
}

export default Admin;
