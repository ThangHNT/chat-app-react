import classNames from 'classnames/bind';
import styles from './Message.module.scss';

const cx = classNames.bind(styles);

function Message({ text = false, children, onClick, img = false, ...passprops }) {
    let Msg = 'p';
    const classname = cx('wrapper', {
        text,
    });

    const props = {
        onClick,
        ...passprops,
    };

    if (img) {
        Msg = 'img';
    }

    return (
        <Msg className={cx(classname)} {...props}>
            {children}
        </Msg>
    );
}

export default Message;
