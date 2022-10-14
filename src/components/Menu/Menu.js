import React, { memo, useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import styles from './Menu.module.scss';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function Menu({ sender, receiver, menu = [], click = false }) {
    const { darkLightMode } = useContext(SettingContext);

    const [catalog, setCatalog] = useState([{ data: menu }]);
    const currentCatalog = catalog[catalog.length - 1];

    const renderItems = () => {
        return currentCatalog.data.map((item, index) => {
            return (
                <Button
                    key={index}
                    darkmodeBtn={darkLightMode}
                    text
                    leftIcon={item.icon}
                    children={item.text}
                    href={item.href}
                    to={item.to}
                    noBorderRadius
                    onClick={() => {
                        const isParent = !!item.children;
                        if (isParent) {
                            setCatalog((pre) => [...pre, item.children]);
                        } else {
                            return item.onClick ? click : undefined;
                        }
                    }}
                />
            );
        });
    };

    const handleOpenPreCatalog = (e) => {
        setCatalog((pre) => pre.slice(0, pre.length - 1));
    };

    return (
        <div className={cx('wrapper')}>
            {catalog.length > 1 && (
                <div className={cx('header')} onClick={handleOpenPreCatalog}>
                    <FontAwesomeIcon icon={faChevronLeft} className={cx('arrow-left')} />
                    <span>{currentCatalog.text}</span>
                </div>
            )}
            <div className={cx('menu-btns')}>{renderItems()}</div>
        </div>
    );
}

export default memo(Menu);
