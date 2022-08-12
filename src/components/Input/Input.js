import React, { forwardRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Input.module.scss';

const cx = classNames.bind(styles);

const Input = forwardRef(
    (
        {
            type,
            title = ' ',
            name,
            arounded,
            placeholder = ' ',
            noLabel = false,
            input = false,
            chat = false,
            file = false,
            onInput,
            onPaste,
            value,
            ...passprops
        },
        ref,
    ) => {
        const handleChange = (e) => {
            if (chat) {
                let value = e.target.value;
                if (value === ' ' || value === '' || value === '\n') {
                    e.target.style.height = '34px';
                }
                let height = e.target.scrollHeight;
                e.target.style.height = `${height + 2}px`;
            }
        };

        let Input = 'input';
        const props = {
            ...passprops,
            onInput,
            onPaste,
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
                    ref={ref}
                    className={classnames}
                    name={name}
                    title={title}
                    type={type}
                    placeholder={placeholder}
                    {...props}
                    onChange={handleChange}
                />
                {!noLabel && (
                    <label className={cx(`label`)} htmlFor={name}>
                        {name}
                    </label>
                )}
            </div>
        );
    },
);

export default Input;
