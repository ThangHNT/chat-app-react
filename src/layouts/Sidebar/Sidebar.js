import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import MessageItem from '~/components/MessageItem';
import Menu from '~/components/Menu';

const cx = classNames.bind(styles);

// const messageItems = [

// ]

const actionsMessageItem = [
    {
        text: 'Xoa doan chat',
        icon: <FontAwesomeIcon icon={faTrashCan} />,
    },
    {
        text: 'Chan',
        icon: <FontAwesomeIcon icon={faBan} />,
    },
];

function Sidebar() {
    const [menuMessageItem, setmenuMessageItem] = useState(false);

    const handleDisplayMenu = () => {
        setmenuMessageItem(true);
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
                <div className={cx('wrapper-message-item')}>
                    <MessageItem
                        avatar="https://9mobi.vn/cf/images/2015/03/nkk/hinh-dep-1.jpg"
                        title="Long tran "
                        message="Hom nay the nao  ?"
                    />
                    <div className={cx('message-item-action-btn')}>
                        <Button circle onClick={handleDisplayMenu}>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </Button>
                        {menuMessageItem && <Menu elements={actionsMessageItem} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
