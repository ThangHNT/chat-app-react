import { useEffect, useState, useRef, memo } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './MessageItem.module.scss';
import Image from '~/components/Image';
import host from '~/ulties/serverHost';
import Button from '~/components/Button';
import Menu from '~/components/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const actionsMessageItem = [
    {
        text: 'Chan',
        icon: <FontAwesomeIcon icon={faBan} />,
    },
    {
        text: 'Xoa doan chat',
        icon: <FontAwesomeIcon icon={faTrashCan} />,
    },
];

function MessageItem({ receiver, avatar, username }) {
    const [lastestMessage, setlastestMessage] = useState();
    const [menuMessageItem, setmenuMessageItem] = useState(false);

    const btnRef = useRef();

    useEffect(() => {
        const senderId = JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
        axios
            .post(`${host}/api/lastest-message`, {
                receiver: receiver.id,
                sender: senderId,
            })
            .then((data) => {
                const data2 = data.data;
                if (data2.status) {
                    if (data2.message.message.sender === senderId) {
                        if (data2.message.message.type === 'text') {
                            setlastestMessage('Ban: ' + data2.message.message.text);
                        } else {
                            setlastestMessage('Ban gui 1 anh ');
                        }
                    } else {
                        setlastestMessage(data2.message.message.text);
                    }
                }
            })
            .catch((error) => {
                console.log('loi lay tin nhan gan nhat');
            });
    }, [receiver.id]);

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (btnRef.current) {
                if (!btnRef.current.contains(e.target)) {
                    setmenuMessageItem(false);
                }
            }
        });
    }, []);

    // display menu-action
    const handleDisplayMenu = (e) => {
        setmenuMessageItem(!menuMessageItem);
    };

    return (
        <div className={cx('wrapper-message-item')}>
            <div className={cx('avatar')}>
                <Image src={avatar} avatar alt="avatar" />
                <span className="online"></span>
            </div>
            <div className={cx('info')}>
                <span className={cx('username')}>{username}</span>
                <p className={cx('message')}>{lastestMessage}</p>
            </div>
            <div className={cx('action-btns')}>
                <div className={cx('wrapper-btn')} ref={btnRef} onClick={handleDisplayMenu}>
                    <Button circle>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </Button>
                </div>
                {menuMessageItem && (
                    <div className={cx('message-item-action-menu')}>
                        <Menu elements={actionsMessageItem} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(MessageItem);
