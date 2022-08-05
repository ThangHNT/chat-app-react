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
    chat = false,
    file = false,
    onInput,
    value,
    ...passprops
}) {
    const handleChange = (e) => {
        if (chat) {
            let value = e.target.value;
            if (value === ' ' || value === '' || value === '\n') {
                e.target.style.height = '34px';
            }
            let height = e.target.scrollHeight;
            e.target.style.height = `${height}px`;
        }
    };

    let Input = 'input';
    const props = {
        ...passprops,
        onInput,
        value,
        maxLength: '100',
    };

    if (chat) {
        Input = 'textarea';
        props.maxLength = '2000';
    }

    const classnames = cx('wrapper', {
        input,
        chat,
        arounded,
        file,
    });

    return (
        <div className={cx('wrapper-input')}>
            <Input
                className={classnames}
                name={name}
                title=" "
                type={type}
                placeholder={placeholder}
                {...props}
                onKeyUp={handleChange}
            />
            {!noLabel && (
                <label className={cx(`label`)} htmlFor={name}>
                    {name}
                </label>
            )}
        </div>
    );
}

export default Input;
