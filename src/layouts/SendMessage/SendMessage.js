import { useState, useEffect, useRef, useMemo, useContext, memo } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { faFaceGrin, faImages } from '@fortawesome/free-regular-svg-icons';
import { faFileLines, faMicrophone } from '@fortawesome/free-solid-svg-icons';
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
    const [blobUrlImg, setBlobUrlImg] = useState('');
    const [imgBase64, setImgBase64] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState('');
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
            ChatContent.handleGetFileInput('');
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (ChatContent.fileInput) {
            let newFile = ChatContent.fileInput;
            // console.log(newFile);
            let base64String = newFile.content;
            let checkFileImage = newFile.type.includes('image');
            base64String = base64String.replace('data:', '').replace(/^.+,/, '');
            if (checkFileImage) {
                setImgBase64(base64String);
            } else if (newFile.type === 'text/plain') {
                const percentEncodedStr = window
                    .atob(base64String)
                    .split('')
                    .map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('');
                let text = decodeURIComponent(percentEncodedStr);
                // console.log(text);
                setFile({
                    filename: newFile.filename,
                    text,
                    size: newFile.size,
                });
            }
            inputRef.current.focus();
        }
    }, [ChatContent.fileInput]);

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
            if (blobUrlImg.length > 0) URL.revokeObjectURL(blobUrlImg);
        };
        // eslint-disable-next-line
    }, [blobUrlImg]);

    const handleRemoveImg = () => {
        setImgBase64('');
        setFile('');
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
                setBlobUrlImg(url);
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
            let content = [];
            let messages = {
                receiver: receiver.id,
                sender: currentUser._id,
                content,
            };
            let textMsg = inputValue.length > 0 ? inputValue.trim() : '';
            // let content;
            if (imgBase64.length > 0) {
                content.push({
                    img: imgBase64,
                    type: 'img',
                    time: new Date().getTime(),
                });
            }
            if (textMsg.length > 0) {
                content.push({
                    text: inputValue.trim(),
                    type: 'text',
                    time: new Date().getTime(),
                });
            }
            if (file.text.length > 0) {
                content.push({
                    file: { content: file.text, filename: file.filename, size: file.size },
                    type: 'text-file',
                    time: new Date().getTime(),
                });
            }
            // console.log(messages);
            if (messages.content.length > 0) {
                handleSendMessage(messages);
                ChatContent.handleAddMessage(messages);
                try {
                    // axios.post(`${host}/api/send-message`, {
                    //     sender: currentUser._id,
                    //     receiver: receiver.id,
                    //     messages,
                    // });
                    setInputValue('');
                    setBlobUrlImg('');
                    setImgBase64('');
                    setFile('');
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
                    <Input noLabel file type="file" input name="file" autoComplete="off" />
                </Button>
                <Button nestInput leftIcon={<FontAwesomeIcon icon={faMicrophone} />}></Button>
            </div>
            <div className={cx('chat-input')}>
                {imgBase64.length > 0 && (
                    <div className={cx('attachment-list')}>
                        <div className={cx('attachment-item')}>
                            <div className={cx('remove-attachment-item')} onClick={handleRemoveImg}>
                                <FontAwesomeIcon className={cx('remove-attachment-icon')} icon={faXmarkCircle} />
                            </div>
                            {imgBase64.length > 0 && <Image pasted src={`data:image/jpeg;base64,${imgBase64}`}></Image>}
                        </div>
                    </div>
                )}
                {file && (
                    <div className={cx('attachment-list')}>
                        <div className={cx('attachment-item')}>
                            <div className={cx('remove-attachment-item')} onClick={handleRemoveImg}>
                                <FontAwesomeIcon className={cx('remove-attachment-icon')} icon={faXmarkCircle} />
                            </div>
                            {file.text.length > 0 && (
                                <div className={cx('wrapper-name-icon-file')}>
                                    <FontAwesomeIcon className={cx('file-icon')} icon={faFileLines} />
                                    <span>{file.filename}</span>
                                </div>
                            )}
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
