import React from 'react';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Menu({ elements = [], noText }) {
    return elements.map((item, index) => {
        return (
            <div key={index} className={cx('wrapper')}>
                <Button messageItem noText={noText} text leftIcon={item.icon} children={item.text} />
            </div>
        );
    });
}

export default Menu;
