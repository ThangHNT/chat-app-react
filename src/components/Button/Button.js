import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    secondary = false,
    large = false,
    small = false,
    text = false,
    disable = false,
    normal = false,
    circle = false,
    children,
    onClick,
    leftIcon,
    ...passprops
}) {
    let Btn = 'button';

    const props = {
        onClick,
        ...passprops,
    };

    if (to) {
        Btn = Link;
        props.to = to;
    } else if (href) {
        props.href = href;
        Btn = 'a';
    }
    if (disable) {
        delete props.onClick;
    }

    const classes = cx('wrapper', {
        primary,
        disable,
        large,
        small,
        text,
        secondary,
        normal,
        circle,
    });

    return (
        <Btn className={classes} {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
        </Btn>
    );
}

export default Button;
