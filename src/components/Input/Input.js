import React, { forwardRef, useContext, memo } from 'react';
import classNames from 'classnames/bind';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
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
            onFocus,
            onKeyDown,
            onPaste,
            handleType,
            value,
            ...passprops
        },
        ref,
    ) => {
        const ChatContent = useContext(ChatContentContext);

        const handleChange = (e) => {
            if (chat) {
                let value = e.target.value;
                if (value === ' ' || value === '' || value === '\n') {
                    e.target.style.height = '34px';
                }
                let height = e.target.scrollHeight;
                e.target.style.height = `${height + 2}px`;
            } else {
                const reader = new FileReader();
                if (e.target.files) {
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = () => {
                        let base64String = reader.result;
                        // console.log(base64String);
                        ChatContent.handleGetBase64(base64String);
                    };
                }
            }
        };

        let Input = 'input';
        const props = {
            ...passprops,
            onInput,
            onFocus,
            onPaste,
            onKeyDown,
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
                    onChange={handleChange}
                    onInput={handleType}
                    {...props}
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

export default memo(Input);
