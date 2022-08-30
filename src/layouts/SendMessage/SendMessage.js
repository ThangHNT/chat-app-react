import { useState, useEffect, useRef, useMemo, useContext, memo } from 'react';
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
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { SocketContext } from '~/components/Context/SocketContext';

const cx = classNames.bind(styles);

function SendMessage({ receiver }) {
    // console.log('Send-message');
    const ChatContent = useContext(ChatContentContext);
    const { handleSendMessage } = useContext(SocketContext);
    // eslint-disable-next-line
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [imgPasted, setImgPasted] = useState('');
    const [imgBase64, setImgBase64] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [displayEmojiList, setDisplayEmojiList] = useState(false);

    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const inputRef = useRef();
    const emojiListBtnRef = useRef();
    const emojiRef = useRef();

    // click bên ra ngoài để đóng emoji list
    useEffect(() => {
        inputRef.current.focus();
        document.addEventListener('click', (e) => {
            if (emojiListBtnRef.current && emojiRef.current) {
                if (!emojiListBtnRef.current.contains(e.target) && !emojiRef.current.contains(e.target)) {
                    setDisplayEmojiList(false);
                }
            }
        });

        return () => {
            document.removeEventListener('click', (e) => {});
        };
    }, []);

    useEffect(() => {
        setImgPasted(ChatContent.base64String);
    }, [ChatContent.base64String]);

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

    const handleRemoveImg = () => {
        setImgPasted('');
    };

    // chọn emoji
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        let emoji = emojiObject.emoji;
        setInputValue((pre) => {
            return pre !== undefined ? pre + emoji : emoji;
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
    const handlePaste = async (e) => {
        const data = await navigator.clipboard.read();
        if (data) {
            const clipboardContent = data[0];
            const type = clipboardContent.types[1];
            if (type === 'image/png') {
                const blob = await clipboardContent.getType('image/png');
                const url = URL.createObjectURL(blob);
                setImgPasted(url);
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                let base64String = '';
                reader.onload = () => {
                    base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                    setImgBase64(base64String);
                };
            }
        }
    };

    const handleEnterSubmit = (e) => {
        let shiftKey = 0;
        if (e.shiftKey) shiftKey = 16;
        if (e.which === 13 && shiftKey !== 16) {
            e.preventDefault();
            let messages = [];
            let textMsg = inputValue.length > 0 ? inputValue.trim() : '';
            if (textMsg.length > 0) {
                messages.push({
                    msg: inputValue.trim(),
                    type: 'text',
                });
            }
            if (imgBase64.length > 0) {
                messages.push({
                    msg: imgBase64,
                    type: 'img',
                });
            }
            // console.log(messages);
            if (messages.length > 0) {
                ChatContent.handleAddMessage(messages);
                const data = { sender: currentUser._id, receiver: receiver.id, content: inputValue };
                handleSendMessage(data);
                try {
                    // axios.post(`${host}/api/send-message`, {
                    //     sender: currentUser._id,
                    //     receiver: receiver.id,
                    //     messages,
                    // });
                    setInputValue('');
                    setImgPasted('');
                } catch (e) {
                    console.log('loi gui tin nhan');
                }
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('chat-btns')}>
                <Button nestInput leftIcon={<FontAwesomeIcon icon={faImages} />}>
                    <Input noLabel file type="file" input name="file" autoComplete="off" accept="image/*" />
                </Button>
                <Button nestInput leftIcon={<FontAwesomeIcon icon={faMicrophone} />}></Button>
            </div>
            <div className={cx('chat-input')}>
                {imgPasted.length > 0 && (
                    <div className={cx('image-list')}>
                        <div className={cx('image-list-item')}>
                            <Image handleRemove={handleRemoveImg} pasted remove src={imgPasted}></Image>
                        </div>
                    </div>
                )}
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Chat here"
                    value={inputValue}
                    chat
                    onKeyDown={handleEnterSubmit}
                    onPaste={handlePaste}
                    onInput={handleType}
                />
            </div>
            <div className={cx('chat-emoji')}>
                <div className={cx('wrapper-emoji-btn')} ref={emojiListBtnRef} onClick={handlDisplayEmojiList}>
                    <Button noTitle leftIcon={<FontAwesomeIcon icon={faFaceGrin} />} />
                </div>
                {displayEmojiList && (
                    <div className={cx('emoji-list')} ref={emojiRef}>
                        <Picker native searchPlaceholder="smile" disableAutoFocus onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(SendMessage);
