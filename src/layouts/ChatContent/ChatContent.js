import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faMicrophone, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faFaceGrin, faImages } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames/bind';
import Picker from 'emoji-picker-react';
import styles from './ChatContent.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import Message from '~/components/Message';
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

    const inputRef = useRef();
    const contentRef = useRef();

    useEffect(() => {
        if (ChatContent.receiver) {
            fetch(`${host}/api/receiver/${encodeURIComponent(ChatContent.receiver)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status) {
                        setReceiver(data.user);
                    } else {
                        alert(data.msg);
                    }
                })
                .catch((err) => {
                    console.log('Loi lay ng nhan');
                });
        }
    }, [ChatContent.receiver]);

    useEffect(() => {
        if (receiver) contentRef.current.scrollTop = contentRef.current.scrollHeight;
        // eslint-disable-next-line
    }, [receiver]);

    useEffect(() => {
        if (receiver) {
            let value = inputRef.current.value;
            if (value === ' ' || value === '' || value === '\n') {
                inputRef.current.style.height = '34px';
            }
            let height = inputRef.current.scrollHeight;
            inputRef.current.style.height = `${height + 2}px`;
        }
        // eslint-disable-next-line
    }, [inputValue]);

    useEffect(() => {
        if (receiver)
            return () => {
                if (imgPasted.length > 0) URL.revokeObjectURL(imgPasted);
            };
        // eslint-disable-next-line
    }, [imgPasted]);

    const handleRemoveImg = useCallback(() => {
        setImgPasted('');
    }, []);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        let emoji = emojiObject.emoji;
        setInputValue((pre) => {
            return pre + emoji;
        });
    };

    const handleType = async (e) => {
        setInputValue(e.target.value);
        const data = await navigator.clipboard.read();
        const clipboardContent = data[0];
        const type = clipboardContent.types[1];
        if (type === 'image/png') {
            const blob = await clipboardContent.getType('image/png');
            const url = URL.createObjectURL(blob);
            setImgPasted(url);
        }
    };

    const handlDisplayEmojiList = (e) => {
        setDisplayEmojiList(!displayEmojiList);
    };

    return (
        <div className={cx('wrapper')}>
            {receiver && (
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
            {receiver && (
                <div ref={contentRef} className={cx('content')}>
                    <div className={cx('messages')}>
                        <div className={cx('message-item')}>
                            <Message text>Hello 500 ae</Message>
                        </div>
                        <div className={cx('message-item')}>
                            <Message receiver text>
                                chao mn nha, minh la tvm
                            </Message>
                        </div>
                        <div className={cx('message-item')}>
                            <Message receiver text>
                                CÔNG TY CỔ PHẦN MTV365 Địa chỉ: Tầng 3,số 1 Trần Nguyên Đán,Khu đô thị Định Công,Hoàng
                                Mai,Hà Nội Vị trí : LẬP TRÌNH VIÊN NODE JS 1. Mô tả công việc - Phát triển phần mềm chat
                                giữa ứng viên và nhà tuyển dụng trên nền tảng Javascrip cho website tuyển dụng. - Thực
                                hiện code phần chat cho ứng viên chat với nhà tuyển dụng, chát dạng tex + truyền nhận
                                file + video. - Phát triển các dự án mới, tư vấn giải pháp, xây dựng, thiết kế để tạo ra
                                các sản phẩm phần mềm tối ưu, phù hợp với nhu cầu của khách hàng. 2.Yêu cầu: - Ko yêu
                                cầu kinh nghiệm,có kiến thức cơ sở về Javascrip,C++,… - Có khả năng làm về ngôn ngữ lập
                                trình nodejs, socket.io trong các dự án cá nhân hoặc thực tế - Có kiến thức về
                                Javacrips, Database, C++ 3. Quyền lợi • Lương khởi điểm: thỏa thuận • Được ăn trưa tại
                                công ty. • Được đóng bảo hiểm xã hội, y tế. • Có thưởng các ngày lễ tết. • Du lịch nghỉ
                                dưỡng hằng năm cùng công ty. • Thưởng theo KPI hàng tuần ( max 500.000 đ). 4.Thời gian
                                làm việc: Thứ 2 - Thứ 7 • Sáng 8h - 11h30 • Chiều 14h – 18h Ứng viên inbox trực tiếp để
                                được trao đổi kỹ hơn hoặc gửi CV qua địa chỉ mail: tranmai96nd@gmail.com
                            </Message>
                        </div>
                        <div className={cx('message-item')}>
                            <Message receiver text>
                                CÔNG TY CỔ PHẦN MTV365 Địa chỉ: Tầng 3,số 1 Trần Nguyên Đán,Khu đô thị Định Công,Hoàng
                                Mai,Hà Nội Vị trí : LẬP TRÌNH VIÊN NODE JS 1. Mô tả công việc - Phát triển phần mềm chat
                                giữa ứng viên và nhà tuyển dụng trên nền tảng Javascrip cho website tuyển dụng. - Thực
                                hiện code phần chat cho ứng viên chat với nhà tuyển dụng, chát dạng tex + truyền nhận
                                file + video. - Phát triển các dự án mới, tư vấn giải pháp, xây dựng, thiết kế để tạo ra
                                các sản phẩm phần mềm tối ưu, phù hợp với nhu cầu của khách hàng. 2.Yêu cầu: - Ko yêu
                                cầu kinh nghiệm,có kiến thức cơ sở về Javascrip,C++,… - Có khả năng làm về ngôn ngữ lập
                                trình nodejs, socket.io trong các dự án cá nhân hoặc thực tế - Có kiến thức về
                                Javacrips, Database, C++ 3. Quyền lợi • Lương khởi điểm: thỏa thuận • Được ăn trưa tại
                                công ty. • Được đóng bảo hiểm xã hội, y tế. • Có thưởng các ngày lễ tết. • Du lịch nghỉ
                                dưỡng hằng năm cùng công ty. • Thưởng theo KPI hàng tuần ( max 500.000 đ). 4.Thời gian
                                làm việc: Thứ 2 - Thứ 7 • Sáng 8h - 11h30 • Chiều 14h – 18h Ứng viên inbox trực tiếp để
                                được trao đổi kỹ hơn hoặc gửi CV qua địa chỉ mail: tranmai96nd@gmail.com
                            </Message>
                        </div>
                    </div>
                </div>
            )}
            {receiver && (
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
                        <Input ref={inputRef} type="text" value={inputValue} chat onInput={handleType} />
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
            {!receiver && (
                <Image noneReceiver src="https://cdn-icons-png.flaticon.com/512/2312/2312512.png" alt="no thing" />
            )}
        </div>
    );
}

export default ChatContent;
