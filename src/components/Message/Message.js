import React, { useEffect, useState, useMemo, useContext, memo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileWord,
    faEllipsisVertical,
    faReply,
    faFileLines,
    faFileExcel,
    faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
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

const cx = classNames.bind(styles);

function Message({
    messageId,
    messageBody,
    reaction = false,
    sender = false,
    time,
    type,
    children,
    onClick,
    darkmodeMsg,
    ...passprops
}) {
    // console.log('message==');
    const ChatContent = useContext(ChatContentContext);
    const { newReaction, handleSetNewReaction } = useContext(SocketContext);
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

    useEffect(() => {
        btnRef.current.style.display = 'none';
        spanRef.current.style.display = 'none';
    }, []);

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
        spanRef.current.style.display = 'flex';
    };

    const handleHideAction = () => {
        btnRef.current.style.display = 'none';
        spanRef.current.style.display = 'none';
    };

    const handleZoomImg = (e) => {
        ChatContent.handleZoomImgae(e.target.src);
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

    return (
        <div className={cx('wrapper', { sender })} onMouseOver={handleDisplayAction} onMouseOut={handleHideAction}>
            <div className={cx('wrapper-content', { sender })}>
                {type === 'text' && !isValidUrl(children) && (
                    <p className={cx('text-message', { darkmodeText: darkmodeMsg })} {...props}>
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
                {(reaction || reactionIcon) && (
                    <div className={cx('reaction-icon', { sender })}>
                        <img src={`${reactionIcon}`} alt="reaction" />
                    </div>
                )}
            </div>
            <div ref={btnRef} className={cx('message-sended-actions')}>
                {!sender && <ReactMessageIcon messageId={messageId} messageBody={messageBody} />}
                <Button message_sended leftIcon={<FontAwesomeIcon icon={faReply} />}></Button>
                <Button message_sended leftIcon={<FontAwesomeIcon icon={faEllipsisVertical} />}></Button>
            </div>
            <span ref={spanRef} className={cx('time-message')}>
                {time}
            </span>
        </div>
    );
}

export default memo(Message);
