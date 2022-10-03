import React, { useEffect, useState, useMemo, useContext, memo, useRef, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileWord,
    faReply,
    faFileLines,
    faFileExcel,
    faFilePdf,
    // faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Tippy from '@tippyjs/react/headless';
import host from '~/ulties/serverHost';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import Button from '~/components/Button';
import ReactMessageIcon from '~/components/ReactMessageIcon';
import sadIcon from '~/assets/images/sad-reaction-icon.png';
import hahaIcon from '~/assets/images/haha-reaction-icon.png';
import heartIcon from '~/assets/images/heart-reaction-icon.png';
import angryIcon from '~/assets/images/angry-reaction-icon.png';
import surprisedIcon from '~/assets/images/surprised-reaction-icon.png';
import likeIcon from '~/assets/images/like-reaction-icon.png';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { SocketContext } from '~/components/Context/SocketContext';
import { SettingContext } from '~/components/Context/SettingContext';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function Message({
    messageId,
    messageBody,
    reaction = false,
    sender = false,
    receiver,
    time,
    type,
    children,
    onClick,
    darkmodeMsg,
    ...passprops
}) {
    // console.log('message==');
    const { theme, handleSetTheme, handleSetDisplayRemoveMessageModal } = useContext(SettingContext);
    const ChatContent = useContext(ChatContentContext);
    const {
        newReaction,
        newTheme,
        handleSetNewReaction,
        reactionRemoved,
        handleRemoveReactionIcon,
        handleRemoveSocketEvent,
    } = useContext(SocketContext);
    const [reactionIcon, setReactionIcon] = useState(() => {
        if (reaction === 'heartIcon') return heartIcon;
        if (reaction === 'surprisedIcon') return surprisedIcon;
        if (reaction === 'likeIcon') return likeIcon;
        if (reaction === 'hahaIcon') return hahaIcon;
        if (reaction === 'sadIcon') return sadIcon;
        if (reaction === 'angryIcon') return angryIcon;
    });

    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    }, []);

    const btnRef = useRef();
    const spanRef = useRef();
    const pRef = useRef();

    // new theme event from socket
    useLayoutEffect(() => {
        if (newTheme) {
            // console.log(receiver);
            if (newTheme.user === receiver) {
                handleRemoveSocketEvent(true);
                handleSetTheme(receiver, newTheme.theme);
            }
        }
        // eslint-disable-next-line
    }, [newTheme]);

    // thay đổi theme khi ấn lưu
    useLayoutEffect(() => {
        if (theme.get(receiver)) {
            // console.log(theme.get(receiver));
            handleChangeTheme(theme.get(receiver));
        }
        // eslint-disable-next-line
    }, [theme.get(receiver)]);

    // listen send reaction icon on socket
    useEffect(() => {
        if (newReaction) {
            if (currentUser === newReaction.receiver && newReaction.messageId === messageId) {
                // console.log(newReaction);
                setReactionIcon(getReactionIcon(newReaction.icon));
                handleSetNewReaction(undefined);
            }
        }
        // eslint-disable-next-line
    }, [newReaction]);

    // hiện reaction ngay sau khi chọn
    useEffect(() => {
        if (ChatContent.reactionIcon) {
            if (messageId === ChatContent.reactionIcon.messageId) {
                setReactionIcon(getReactionIcon(ChatContent.reactionIcon.icon));
            }
        }
        // eslint-disable-next-line
    }, [ChatContent.reactionIcon]);

    const getReactionIcon = (icon) => {
        if (icon === 'heartIcon') return heartIcon;
        if (icon === 'surprisedIcon') return surprisedIcon;
        if (icon === 'likeIcon') return likeIcon;
        if (icon === 'hahaIcon') return hahaIcon;
        if (icon === 'sadIcon') return sadIcon;
        if (icon === 'angryIcon') return angryIcon;
    };

    const props = {
        onClick,
        ...passprops,
    };

    const handleDisplayAction = () => {
        btnRef.current.style.display = 'flex';
        spanRef.current.style.display = 'block';
    };

    const handleHideAction = () => {
        btnRef.current.style.display = 'none';
        spanRef.current.style.display = 'none';
    };

    const handleZoomImg = (e) => {
        ChatContent.handleZoomImgae(e.target.src);
    };

    const handleChangeTheme = (theme) => {
        if (pRef.current) {
            // console.log(pRef.current);
            for (let i = 0; i < 15; i++) {
                if (i !== theme) {
                    pRef.current.classList.remove(`theme${i}`);
                    pRef.current.classList.remove(`add-theme`);
                }
            }
            pRef.current.classList.add(`theme${theme}`);
            pRef.current.classList.add(`add-theme`);
        }
    };

    const handleRemoveIcon = async (e) => {
        // console.log(reactionIcon);
        if (!sender) {
            setReactionIcon(false);
            handleRemoveReactionIcon(receiver, messageId);
        }
        // const data = await axios.post(`${host}/api/remove/reaction-icon`, { messageId });
        // if (!data.status) {
        //     console.log('xoa icon that bai');
        // }
    };

    const isValidUrl = (urlString) => {
        var urlPattern = new RegExp(
            '^(https?:\\/\\/)?' + // validate protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
                '(\\#[-a-z\\d_]*)?$',
            'i',
        ); // validate fragment locator
        return !!urlPattern.test(urlString);
    };

    const handleDisplayRemoveMessageModal = () => {
        handleSetDisplayRemoveMessageModal();
    };

    return (
        <div className={cx('wrapper', { sender })} onMouseOver={handleDisplayAction} onMouseOut={handleHideAction}>
            <div className={cx('wrapper-content', { sender })}>
                {type === 'text' && !isValidUrl(children) && (
                    <p ref={pRef} className={cx('text-message', { darkmodeText: darkmodeMsg })} {...props}>
                        {children}
                    </p>
                )}
                {type === 'text' && isValidUrl(children) && (
                    <a
                        href={children}
                        className={cx('text-message', { urlText: true })}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {children}
                    </a>
                )}
                {type === 'img' && (
                    <img
                        className={cx('img-message')}
                        onClick={handleZoomImg}
                        src={`data:image/jpeg;base64,${children}`}
                        alt="message-img"
                    />
                )}
                {type === 'text-file' && (
                    <a
                        className={cx('wrapper-file-message')}
                        href={`data:attachment/text,${encodeURIComponent(children.content)}`}
                        download={children.filename}
                    >
                        <FontAwesomeIcon className={cx('file-icon')} icon={faFileLines} />
                        <div className={cx('properties')}>
                            <p>{children.filename}</p>
                            <span>{children.size}B</span>
                        </div>
                    </a>
                )}
                {type === 'video' && (
                    <video
                        className={cx('video')}
                        src={`data:video/mp4;base64,${children.content}`}
                        controls
                        autoPlay
                    ></video>
                )}
                {type === 'audio' && <audio src={`data:audio/mpeg;base64,${children.content}`} controls></audio>}
                {type === 'doc-file' && (
                    <a
                        className={cx('wrapper-file-message')}
                        href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${encodeURIComponent(
                            children.content,
                        )}`}
                        download={children.filename}
                    >
                        <FontAwesomeIcon className={cx('file-icon')} icon={faFileWord} />
                        <div className={cx('properties')}>
                            <p>{children.filename}</p>
                            <span>{children.size}B</span>
                        </div>
                    </a>
                )}
                {type === 'pdf-file' && (
                    <a
                        className={cx('wrapper-file-message')}
                        href={`data:application/pdf;base64,${encodeURIComponent(children.content)}`}
                        download={children.filename}
                    >
                        <FontAwesomeIcon className={cx('file-icon')} icon={faFilePdf} />
                        <div className={cx('properties')}>
                            <p>{children.filename}</p>
                            <span>{children.size}B</span>
                        </div>
                    </a>
                )}
                {type === 'excel-file' && (
                    <a
                        className={cx('wrapper-file-message')}
                        href={`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${encodeURIComponent(
                            children.content,
                        )}`}
                        download={children.filename}
                    >
                        <FontAwesomeIcon className={cx('file-icon')} icon={faFileExcel} />
                        <div className={cx('properties')}>
                            <p>{children.filename}</p>
                            <span>{children.size}B</span>
                        </div>
                    </a>
                )}
                {reactionIcon && (
                    <div className={cx('reaction-icon', { sender })} onClick={handleRemoveIcon}>
                        <img src={`${reactionIcon}`} alt="reaction" />
                    </div>
                )}
            </div>
            <div ref={btnRef} className={cx('message-sended-actions')}>
                {!sender && !reactionRemoved && <ReactMessageIcon messageId={messageId} messageBody={messageBody} />}
                <div className={cx('wapper-tippy')}>
                    <Tippy
                        interactive
                        placement="bottom"
                        render={(attrs) => (
                            <div className={cx('delete-message-tippy')} tabIndex="-1" {...attrs}>
                                Trả lời
                            </div>
                        )}
                    >
                        <div className={cx('message-sended-btn')}>
                            <Button message_sended leftIcon={<FontAwesomeIcon icon={faReply} />}></Button>
                        </div>
                    </Tippy>
                </div>
                <div className={cx('wapper-tippy')}>
                    <Tippy
                        interactive
                        placement="bottom"
                        render={(attrs) => (
                            <div className={cx('delete-message-tippy')} tabIndex="-1" {...attrs}>
                                Xóa, gỡ bỏ
                            </div>
                        )}
                    >
                        <div className={cx('message-sended-btn')} onClick={handleDisplayRemoveMessageModal}>
                            <Button message_sended leftIcon={<FontAwesomeIcon icon={faTrashCan} />}></Button>
                        </div>
                    </Tippy>
                </div>
            </div>
            <span ref={spanRef} className={cx('time-message')}>
                {time}
            </span>
        </div>
    );
}

export default memo(Message);
