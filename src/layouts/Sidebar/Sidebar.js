import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import Button from '~/components/Button';
import MessageItem from '~/components/MessageItem';
import Menu from '~/components/Menu';

const cx = classNames.bind(styles);

const messageItems = [
    {
        avatar: 'https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-dep-1.jpg',
        username: 'Thang Hoang',
        message: 'hello',
    },
    {
        avatar: 'https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-dep-1.jpg',
        username: 'hai long',
        message: 'cho t vay it tien',
    },
    {
        avatar: 'https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-dep-1.jpg',
        username: 'tran toan',
        message: 'dao nay ban khoe khong?',
    },
    {
        avatar: 'https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-dep-1.jpg',
        username: 'le bao',
        message: 'nay da bong ko?',
    },
    {
        avatar: 'https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-dep-1.jpg',
        username: 'nguyen huy',
        message: 'toi an com r',
    },
    {
        avatar: 'https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-dep-1.jpg',
        username: 'nguyen huy',
        message: 'toi an com r',
    },
];

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

    // const btnRef = useRef();

    const handleDisplayMenu = (e) => {
        const div = e.target.closest('div');
        setmenuMessageItem((pre) => {
            return pre !== Number(div.id) ? Number(div.id) : -1;
        });
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
                {messageItems.map((item, index) => (
                    <div key={index} className={cx('wrapper-message-item')}>
                        <MessageItem avatar={item.avatar} message={item.message} username={item.username} />
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
