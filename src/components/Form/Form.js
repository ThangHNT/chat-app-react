import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './Form.module.scss';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { UserContext } from '../Context/UserContext';

const cx = classNames.bind(styles);

function Form({ login, signup }) {
    const User = useContext(UserContext);

    // eslint-disable-next-line
    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    });

    const checkValues = () => {
        let username = values.username;
        let password = values.password;
        let confirmPassword = values.confirmPassword;

        if (username.length < 3) {
            toast.warning('Độ dài tối thiểu là 3 ký tự');
            return false;
        }
        // if (password.length < 8 || password.includes(' ')) {
        //     toast.warning('Mật khẩu ít nhất 8 ký tự và không có dấu cách');
        //     return false;
        // }
        if (password !== confirmPassword && confirmPassword.length > 0) {
            toast.error('Mật khẩu không trùng khớp');
            return false;
        }
        return true;
    };

    // ấn enter để đăng nhập
    const handlSubmit = async (e) => {
        e.preventDefault();
        if (checkValues()) {
            if (values.confirmPassword.length > 0) {
                console.log('register');
                try {
                    const { data } = await axios.post('/register', values);
                    if (data.status === true) {
                        toast('Đăng ký thành công');
                        User.setUser(data.newUser);
                        localStorage.setItem('chat-app-hnt', JSON.stringify(data.newUser));
                        setTimeout(function () {
                            navigate('/', { replace: true });
                        }, 2500);
                    } else {
                        toast(data.msg);
                    }
                } catch (e) {
                    alert('register request failed, start server');
                }
            } else {
                try {
                    const { data } = await axios.post('/login', values);
                    if (data.status === false) {
                        toast(data.msg);
                    } else {
                        console.log('login');
                        localStorage.setItem('chat-app-hnt', JSON.stringify(data.user));
                        User.setUser(data.user);
                        toast('Chuyển hướng đến trang chủ');
                        setTimeout(function () {
                            navigate('/', { replace: true });
                        }, 1500);
                    }
                } catch (e) {
                    alert('login req failed, start server');
                }
            }
        }
    };

    return (
        <form className={cx('form')} onSubmit={handlSubmit}>
            <div className={cx('wrapper-input')}>
                <Input
                    value={values.username}
                    onInput={(e) => {
                        setValues((pre) => {
                            pre.username = e.target.value.trim();
                            return {
                                ...pre,
                            };
                        });
                    }}
                    type="text"
                    title="Tên người dùng"
                    input
                    name="username"
                    autoComplete="off"
                    required
                />
            </div>
            <div className={cx('wrapper-input')}>
                <Input
                    value={values.password}
                    onInput={(e) => {
                        setValues((pre) => {
                            pre.password = e.target.value.trim();
                            return {
                                ...pre,
                            };
                        });
                    }}
                    type="password"
                    input
                    title="Mật khẩu"
                    name="password"
                    autoComplete="off"
                    required
                />
            </div>
            {signup && (
                <div className={cx('wrapper-input')}>
                    <Input
                        value={values.confirmPassword}
                        onInput={(e) => {
                            setValues((pre) => {
                                pre.confirmPassword = e.target.value;
                                return {
                                    ...pre,
                                };
                            });
                        }}
                        type="password"
                        input
                        title="Nhập lại mật khẩu"
                        name="confirm-password"
                        autoComplete="off"
                        required
                    />
                </div>
            )}
            {signup && (
                <div className={cx('wrapper-input')}>
                    <Input
                        value={values.email}
                        onInput={(e) => {
                            setValues((pre) => {
                                pre.email = e.target.value;
                                return {
                                    ...pre,
                                };
                            });
                        }}
                        type="email"
                        input
                        title="Địa chỉ email"
                        name="email"
                        autoComplete="off"
                        required
                    />
                </div>
            )}

            <div className={cx('login-btn')}>
                {login && <Button large primary children="Đăng nhập" />}
                {signup && <Button large secondary children="Đăng ký" />}
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
        </form>
    );
}

export default Form;
