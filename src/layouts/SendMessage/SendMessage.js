import { useState, useEffect, useRef, useLayoutEffect, useMemo, useContext, memo } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileVideo, faFileWord, faPhotoFilm, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { faFaceGrin, faFileLines, faFileAudio, faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import Button from '~/components/Button';
import Input from '~/components/Input';
import styles from './SendMessage.module.scss';
import host from '~/ulties/serverHost';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { SocketContext } from '~/components/Context/SocketContext';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function SendMessage({ receiver, darkmode = false }) {
    // console.log('Send-message');
    const ChatContent = useContext(ChatContentContext);
    const { handleSendMessage, preventation } = useContext(SocketContext);
    const { handlSetBlockStatus, blockStatus } = useContext(SettingContext);
    // eslint-disable-next-line
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [blobUrlImg, setBlobUrlImg] = useState('');
    const [imgBase64, setImgBase64] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState();
    const [displayEmojiList, setDisplayEmojiList] = useState(false);
    const [block, setBlock] = useState({});

    let messageSound = new Audio();

    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const inputRef = useRef();
    const emojiListBtnRef = useRef();
    const emojiRef = useRef();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });

    // click bên ra ngoài để đóng emoji list
    useLayoutEffect(() => {
        handleGetBlockStatus();
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
            messageSound.remove();
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (blockStatus) {
            if (blockStatus.receiver === receiver.id) {
                setBlock(blockStatus);
            }
        } else {
            // console.log('goi db');
            handleGetBlockStatus();
        }
        // eslint-disable-next-line
    }, [blockStatus]);

    // listen event block in socket
    useEffect(() => {
        if (preventation) {
            // console.log(preventation);
            if (preventation.block && preventation.sender === receiver.id) {
                handlSetBlockStatus({ blocked: true, block: blockStatus.block, receiver: receiver.id });
            } else if (preventation.unblock && preventation.sender === receiver.id) {
                handlSetBlockStatus({ blocked: false, block: blockStatus.block, receiver: receiver.id });
            }
        }
        // eslint-disable-next-line
    }, [preventation]);

    // khi chọn file từ ô input
    useEffect(() => {
        if (ChatContent.fileInput) {
            let newFile = ChatContent.fileInput;
            let base64String = newFile.content;
            let checkFileImage = newFile.type.includes('image');
            base64String = base64String.replace('data:', '').replace(/^.+,/, '');
            // console.log(newFile.type);
            // console.log(base64String);
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
                setFile({
                    filename: newFile.filename,
                    text,
                    size: newFile.size,
                    type: 'text-file',
                });
            } else if (newFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile({
                    filename: newFile.filename,
                    text: base64String,
                    size: newFile.size,
                    type: 'doc-file',
                });
            } else if (newFile.type === 'application/pdf') {
                setFile({
                    filename: newFile.filename,
                    text: base64String,
                    size: newFile.size,
                    type: 'pdf-file',
                });
            } else if (newFile.type === 'video/mp4') {
                setFile({
                    filename: newFile.filename,
                    text: base64String,
                    size: newFile.size,
                    type: 'video',
                });
            } else if (newFile.type.includes('audio')) {
                setFile({
                    filename: newFile.filename,
                    text: base64String,
                    size: newFile.size,
                    type: 'audio',
                });
            } else if (newFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                console.log('file excel');
                setFile({
                    filename: newFile.filename,
                    text: base64String,
                    size: newFile.size,
                    type: 'excel-file',
                });
            }

            inputRef.current.focus();
        }
    }, [ChatContent.fileInput]);

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
        messageSound.src = 'texting-sound.mp3';
        // messageSound.play();
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

    // ấn enter để gửi tin nhắn
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
            if (file) {
                if (file.text.length > 0) {
                    content.push({
                        file: { content: file.text, filename: file.filename, size: file.size },
                        type: file.type,
                        time: new Date().getTime(),
                    });
                }
            }
            // console.log(messages);
            if (messages.content.length > 0) {
                inputRef.current.setHeight(32);
                messageSound.src = 'send-message-sound.mp3';
                messageSound.play();
                handleSendMessage(messages);
                ChatContent.handleAddMessage(messages);
                try {
                    // axios.post(`${host}/api/send/message`, {
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

    // kiểm tra tình trạng chặn
    const handleGetBlockStatus = async () => {
        const data = await axios.post(`${host}/api/check-block-status`, {
            currentUser: currentUser._id,
            receiver: ChatContent.receiver,
        });
        if (data) {
            const data2 = data.data;
            // console.log(data2);
            setBlock(data2);
            handlSetBlockStatus(data2);
        } else {
            console.log('loi check block status');
        }
    };

    return (
        <div className={cx('wrapper')}>
            {block && (
                <div className={cx('body')}>
                    {!block.block && !block.blocked && (
                        <div className={cx('chat-area')}>
                            <div className={cx('chat-btns')}>
                                <Button nestInput leftIcon={<FontAwesomeIcon icon={faPhotoFilm} />}>
                                    <Input noLabel file type="file" input name="file" autoComplete="off" />
                                </Button>
                                <Button nestInput leftIcon={<FontAwesomeIcon icon={faMicrophone} />}></Button>
                            </div>
                            <div className={cx('chat-input')}>
                                {imgBase64.length > 0 && (
                                    <div className={cx('attachment-list')}>
                                        <div className={cx('attachment-item')}>
                                            <div className={cx('remove-attachment-item')} onClick={handleRemoveImg}>
                                                <FontAwesomeIcon
                                                    className={cx('remove-attachment-icon', {
                                                        removeIconDarkmode: darkmode,
                                                    })}
                                                    icon={faXmarkCircle}
                                                />
                                            </div>
                                            {imgBase64.length > 0 && (
                                                <Image pasted src={`data:image/jpeg;base64,${imgBase64}`}></Image>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {file && (
                                    <div className={cx('attachment-list')}>
                                        <div className={cx('attachment-item')}>
                                            <div className={cx('remove-attachment-item')} onClick={handleRemoveImg}>
                                                <FontAwesomeIcon
                                                    className={cx('remove-attachment-icon')}
                                                    icon={faXmarkCircle}
                                                />
                                            </div>
                                            <div className={cx('wrapper-name-icon-file')}>
                                                <FontAwesomeIcon
                                                    className={cx('file-icon')}
                                                    icon={
                                                        file.type === 'text-file'
                                                            ? faFileLines
                                                            : file.type === 'doc-file'
                                                            ? faFileWord
                                                            : file.type === 'video'
                                                            ? faFileVideo
                                                            : file.type === 'pdf-file'
                                                            ? faFilePdf
                                                            : file.type === 'audio'
                                                            ? faFileAudio
                                                            : faFileExcel
                                                    }
                                                />

                                                <span>{file.filename}</span>
                                            </div>
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
                                <div
                                    className={cx('wrapper-emoji-btn')}
                                    ref={emojiListBtnRef}
                                    onClick={handlDisplayEmojiList}
                                >
                                    <Button noTitle leftIcon={<FontAwesomeIcon icon={faFaceGrin} />} />
                                </div>
                                {displayEmojiList && (
                                    <div className={cx('emoji-list')} ref={emojiRef}>
                                        <Picker
                                            native
                                            searchPlaceholder="smile"
                                            disableAutoFocus
                                            onEmojiClick={onEmojiClick}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(block.block || block.blocked) && (
                        <div className={cx('block-status')}>
                            {block.block && (
                                <div className={cx('block-status-body')}>
                                    <span>
                                        Ban da chan
                                        <span className={cx('username')}>{receiver.username}</span>
                                    </span>
                                </div>
                            )}
                            {block.blocked && (
                                <span>
                                    Ban da bi
                                    <span className={cx('username')}>{receiver.username}</span>
                                    chan
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(SendMessage);
