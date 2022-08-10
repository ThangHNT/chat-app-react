import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import Button from '~/components/Button';
import MessageItem from '~/components/MessageItem';
import Menu from '~/components/Menu';
import host from '~/ulties/serverHost';

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

function Sidebar() {
    const [menuMessageItem, setmenuMessageItem] = useState(-1);
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        fetch(`${host}/api/message-item`)
            .then((response) => response.json())
            .then((data) => {
                setListUser(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleDisplayMenu = (e) => {
        // lấy element div
        const div = e.target.closest('div');
        setmenuMessageItem((pre) => {
            return pre !== Number(div.id) ? Number(div.id) : -1;
        });
    };

    const handleClick = (e) => {
        const target = e.target;
        let userId = '';
        if (target.className.indexOf('wrapper') > -1) {
        } else if (target.parentNode.className.indexOf('wrapper') > -1) {
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('action')}>
                    <h3>Chat</h3>
                    <Button circle>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </Button>
                </div>
                <div className={cx('search')}>
                    <Search />
                </div>
            </div>
            <div className={cx('content')}>
                {listUser.map((item, index) => (
                    <div key={index} className={cx('wrapper-message-item')}>
                        <MessageItem
                            onClick={handleClick}
                            userId={item._id}
                            avatar={item.avatar}
                            username={item.username}
                        />
                        <div id={index} className={cx('wrapper-btn')} onClick={handleDisplayMenu}>
                            <Button circle>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </Button>
                        </div>
                        {menuMessageItem === index && (
                            <div className={cx('message-item-action-menu')}>
                                <Menu elements={actionsMessageItem} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
