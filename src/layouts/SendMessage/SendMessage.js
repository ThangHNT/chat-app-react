import { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrin, faImages } from '@fortawesome/free-regular-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import Button from '~/components/Button';
import Input from '~/components/Input';
import styles from './SendMessage.module.scss';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function SendMessage({ receiver }) {
    // eslint-disable-next-line
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [imgPasted, setImgPasted] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [displayEmojiList, setDisplayEmojiList] = useState(false);
    const inputRef = useRef();

    const handleRemoveImg = useCallback(() => {
        setImgPasted('');
    }, []);

    // mở rộng input
    useEffect(() => {
        let value = inputRef.current.value;
        if (value === ' ' || value === '' || value === '\n') {
            inputRef.current.style.height = '34px';
        }
        let height = inputRef.current.scrollHeight;
        inputRef.current.style.height = `${height + 2}px`;
        // eslint-disable-next-line
    }, [inputValue]);

    // xóa URL ảnh cũ khi chọn ảnh mới
    useEffect(() => {
        return () => {
            if (imgPasted.length > 0) URL.revokeObjectURL(imgPasted);
        };
        // eslint-disable-next-line
    }, [imgPasted]);

    // chọn emoji
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        let emoji = emojiObject.emoji;
        setInputValue((pre) => {
            return pre + emoji;
        });
    };

    // xử lý 2 chiều khi gõ vào input
    const handleType = (e) => {
        setInputValue(e.target.value);
    };

    // hiển thị ds emoji
    const handlDisplayEmojiList = (e) => {
        setDisplayEmojiList(!displayEmojiList);
    };

    // lắng nghe sự kiện paste
    const handlePaste = async () => {
        const data = await navigator.clipboard.read();
        const clipboardContent = data[0];
        const type = clipboardContent.types[1];
        if (type === 'image/png') {
            const blob = await clipboardContent.getType('image/png');
            const url = URL.createObjectURL(blob);
            setImgPasted(url);
        }
    };

    const handleEnterSubmit = (e) => {
        let shiftKey = 0;
        if (e.shiftKey) shiftKey = 16;
        if (e.which === 13 && shiftKey !== 16) {
            e.preventDefault();
            try {
                axios.post(`${host}/api/send-message`, {
                    receiver: receiver.id,
                    content: inputValue,
                    type: 'text',
                });
                setInputValue('');
            } catch (e) {
                console.log('loi gui tin nhan');
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('chat-btns')}>
                <Button nestInput leftIcon={<FontAwesomeIcon icon={faImages} />}>
                    <Input noLabel file type="file" input name="file" autoComplete="off" />
                </Button>
                <Button nestInput leftIcon={<FontAwesomeIcon icon={faMicrophone} />}></Button>
            </div>
            <div className={cx('chat-input')}>
                {imgPasted.length > 0 && (
                    <div className={cx('image-list')}>
                        <div className={cx('image-list-item')}>
                            <Image handleRemove={handleRemoveImg} small remove src={imgPasted}></Image>
                        </div>
                    </div>
                )}
                <Input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    chat
                    onKeyDown={handleEnterSubmit}
                    onPaste={handlePaste}
                    onInput={handleType}
                />
            </div>
            <div className={cx('chat-emoji')}>
                <div className={cx('wrapper-emoji-btn')} onClick={handlDisplayEmojiList}>
                    <Button noTitle leftIcon={<FontAwesomeIcon icon={faFaceGrin} />} />
                </div>
                {displayEmojiList && (
                    <div className={cx('emoji-list')}>
                        <Picker native searchPlaceholder="smile" disableAutoFocus onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SendMessage;
