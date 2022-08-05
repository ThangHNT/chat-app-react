import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Form.module.scss';
import Input from '~/components/Input';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Form({ login, signup }) {
    const navigate = useNavigate();
    const handlSubmit = (e) => {
        e.preventDefault();
    };

    const handleLogin = () => {
        console.log('login');
        navigate('/home', { replace: true });
    };

    return (
        <form className={cx('form')} onSubmit={handlSubmit}>
            <div className={cx('wrapper-input')}>
                <Input type="text" title="Tên người dùng" input name="username" autoComplete="off" />
            </div>
            <div className={cx('wrapper-input')}>
                <Input type="password" input title="Mật khẩu" name="password" autoComplete="off" />
            </div>
            {signup && (
                <div className={cx('wrapper-input')}>
                    <Input type="password" input title="Nhập lại mật khẩu" name="confirm-password" autoComplete="off" />
                </div>
            )}
            {signup && (
                <div className={cx('wrapper-input')}>
                    <Input type="email" input title="Địa chỉ email" name="email" autoComplete="off" />
                </div>
            )}

            <div className={cx('login-btn')}>
                {login && <Button large primary children="Đăng nhập" onClick={handleLogin} />}
                {signup && <Button large secondary children="Đăng ký" />}
            </div>
        </form>
    );
}

export default Form;
