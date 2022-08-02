import { forwardRef } from 'react';
import defaultImg from '~/assets/images/No-Image-Placeholder.svg.png';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';

const cx = classNames.bind(styles);

const Image = forwardRef(({ src, alt, logo, avatar, className, arounded = false, ...props }, ref) => {
    return (
        <img
            ref={ref}
            src={src || defaultImg}
            alt={alt}
            className={cx(className, {
                arounded,
                logo,
                avatar,
            })}
            {...props}
        />
    );
});

export default Image;
