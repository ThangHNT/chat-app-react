import { forwardRef, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import defaultImg from '~/assets/images/No-Image-Placeholder.svg.png';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const Image = forwardRef(
    (
        {
            src,
            alt,
            logo,
            online = false,
            small = false,
            remove = false,
            arounded = false,
            noneReceiver = false,
            pasted = false,
            avatar,
            className,
            onClick,
            handleRemove,
            ...passprops
        },
        ref,
    ) => {
        const props = {
            onClick,
            ...passprops,
        };

        return (
            <div className={cx('wrapper')}>
                <img
                    ref={ref}
                    src={src || defaultImg}
                    alt={alt}
                    className={cx(className, {
                        arounded,
                        logo,
                        avatar,
                        online,
                        small,
                        pasted,
                        remove,
                        noneReceiver,
                    })}
                    {...props}
                />
                {remove && (
                    <div className={cx('remove-image')} onClick={handleRemove}>
                        <Button closeImage noTitle leftIcon={<FontAwesomeIcon icon={faXmarkCircle} />} />
                    </div>
                )}
            </div>
        );
    },
);

export default memo(Image);
