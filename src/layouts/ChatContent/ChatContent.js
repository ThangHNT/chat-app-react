import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faMicrophone, faPhone, faSpinner, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faFaceGrin, faImages } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames/bind';
import Picker from 'emoji-picker-react';
import styles from './ChatContent.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import Messages from '~/layouts/Messages';
import Input from '~/components/Input';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function ChatContent() {
    const ChatContent = useContext(ChatContentContext);
    // eslint-disable-next-line
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [displayEmojiList, setDisplayEmojiList] = useState(false);
    const [imgPasted, setImgPasted] = useState('');
    const [receiver, setReceiver] = useState();
    const [loading, setLoading] = useState(false);

    const inputRef = useRef();
    const contentRef = useRef();

    // lấy thông tin ng nhận khi ấn vào user bên sidebar
    console.log('render');
    useEffect(() => {
        if (ChatContent.receiver) {
            console.log('render-1');
            setLoading(true);
            fetch(`${host}/api/receiver/${encodeURIComponent(ChatContent.receiver)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status) {
                        setReceiver(data.user);
                    } else {
                        alert(data.msg);
                    }
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('Loi lay ng nhan');
                });
        }
    }, [ChatContent.receiver]);

    // cuộn tin nhắn xuống dưới cùng khi load xog đoạn chat
    useEffect(() => {
        if (receiver) {
            console.log('render-2');
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
        // eslint-disable-next-line
    }, [receiver]);

    // mở rộng input
    useEffect(() => {
        if (receiver) {
            console.log('render-3');
            let value = inputRef.current.value;
            if (value === ' ' || value === '' || value === '\n') {
                inputRef.current.style.height = '34px';
            }
            let height = inputRef.current.scrollHeight;
            inputRef.current.style.height = `${height + 2}px`;
        }
        // eslint-disable-next-line
    }, [inputValue]);

    // xóa URL ảnh cũ khi chọn ảnh mới
    useEffect(() => {
        if (receiver) {
            console.log('render-4');
            return () => {
                if (imgPasted.length > 0) URL.revokeObjectURL(imgPasted);
            };
        }
        // eslint-disable-next-line
    }, [imgPasted]);

    const handleRemoveImg = useCallback(() => {
        console.log('render-5');
        setImgPasted('');
    }, []);

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
        console.log('render-6');
        setInputValue(e.target.value);
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

    // hiển thị ds emoji
    const handlDisplayEmojiList = (e) => {
        console.log('render-7');
        setDisplayEmojiList(!displayEmojiList);
    };

    return (
        <div className={cx('wrapper')}>
            {receiver && !loading && (
                <div className={cx('header')}>
                    <div className={cx('receiver')}>
                        <div>
                            <div className={cx('wrapper-img')}>
                                <Image arounded src={receiver.avatar} />
                                <span className="online"></span>
                            </div>
                        </div>
                        <div className={cx('info')}>
                            <span>{receiver.username}</span>
                            <p>Dang hoat dong</p>
                        </div>
                    </div>
                    <div className={cx('action-btns')}>
                        <Button noTitle leftIcon={<FontAwesomeIcon icon={faPhone} />}></Button>
                        <Button noTitle leftIcon={<FontAwesomeIcon icon={faVideo} />}></Button>
                        <Button noTitle leftIcon={<FontAwesomeIcon icon={faCircleInfo} />}></Button>
                    </div>
                </div>
            )}
            {receiver && !loading && (
                <div ref={contentRef} className={cx('content')}>
                    <Messages />
                </div>
            )}
            {receiver && !loading && (
                <div className={cx('send-message')}>
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
            )}
            {!receiver && !loading && (
                <Image noneReceiver src="https://cdn-icons-png.flaticon.com/512/2312/2312512.png" alt="no thing" />
            )}

            {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
        </div>
    );
}

export default ChatContent;
