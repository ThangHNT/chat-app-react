import { useEffect, useContext, useState, memo } from 'react';
import { SocketContext } from '~/components/Context/SocketContext';
import classNames from 'classnames/bind';
import styles from './PositiveStatus.module.scss';
const cx = classNames.bind(styles);

function PositiveStatus({ receiver }) {
    // console.log('online-status');
    const { newUser, userList } = useContext(SocketContext);
    const [positive, setPositive] = useState(false);

    // console.log(receiver);

    useEffect(() => {
        console.log(userList);
        if (userList.length > 0) {
            setPositive(
                userList.some((user) => {
                    return receiver === user.userId;
                }),
            );
        }
    }, [userList]);

    useEffect(() => {
        console.log(userList);
        if (newUser) {
            setPositive(receiver === newUser.userId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUser]);

    return <div className={cx('wrapper')}>{positive && <span className={cx('online')}></span>}</div>;
}

export default memo(PositiveStatus);
