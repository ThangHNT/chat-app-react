import classNames from 'classnames/bind';
import styles from './Input.module.scss';

const cx = classNames.bind(styles);

function Input({
    type,
    title,
    name,
    arounded,
    noLabel = false,
    placeholder = ' ',
    input = false,
    message = false,
    ...props
}) {
    let Input = 'input';
    if (message) {
        Input = 'textarea';
    }

    const classnames = cx('wrapper', {
        input,
        message,
        arounded,
    });

    return (
        <div className={cx('wrapper-input')}>
            <Input className={classnames} name={name} type={type} placeholder={placeholder} {...props} />
            {!noLabel && (
                <label className={cx(`label`)} htmlFor={name}>
                    {name}
                </label>
            )}
        </div>
    );
}

export default Input;
