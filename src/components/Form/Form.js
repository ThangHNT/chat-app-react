import React from 'react';
import classNames from 'classnames/bind';
import styles from './Form.module.scss';
import Input from '~/components/Input';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Form({ login, signup }) {
    const handlSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className={cx('form')} onSubmit={handlSubmit}>
            <Input type="text" input name="username" autoComplete="off" />
            <Input type="password" input name="password" autoComplete="off" />
            {signup && <Input type="password" input name="confirm-password" autoComplete="off" />}
            {signup && <Input type="email" input name="email" autoComplete="off" />}

            <div className={cx('login-btn')}>
                {login && <Button large primary children="Đăng nhập" />}
                {signup && <Button large secondary children="Đăng ký" />}
            </div>
        </form>
    );
}

export default Form;
