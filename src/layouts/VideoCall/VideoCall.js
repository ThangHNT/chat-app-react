import { useContext, useEffect, useState, useRef, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faPhone, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import Peer from 'simple-peer';
import classNames from 'classnames/bind';
import styles from './VideoCall.module.scss';
import { SocketContext } from '~/components/Context/SocketContext';
import { CallContext } from '~/components/Context/CallContext';
import { UserContext } from '~/components/Context/UserContext';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

function VideoCall() {
    const { friends, currentUser } = useContext(UserContext);
    const ChatContent = useContext(ChatContentContext);
    const { waitUserAnswer, handleDisplayCallVideo, newCall, initCall, handleInitCall } = useContext(CallContext);
    const { socket, callerSignal, handleCallToUser } = useContext(SocketContext);
    const [caller, setCaller] = useState({ username: '', avatar: '', notify: '' });
    // const [callerSignal, setCallerSignal] = useState();
    const [stream, setStream] = useState();
    const myVideo = useRef();
    const userVideo = useRef();

    useEffect(() => {
        // console.log(newCall);
        if (!newCall || initCall) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
                setStream(stream);
                myVideo.current.srcObject = stream;
            });
        }

        if (initCall) {
            handleCall();
        }

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (newCall) {
            const caller = friends.get(newCall);
            setCaller({ username: caller.username, avatar: caller.avatar, notify: 'Cuộc gọi đến' });
        } else {
            setCaller((pre) => {
                return { avatar: waitUserAnswer.avatar, username: waitUserAnswer.username, notify: 'Đang gọi ....' };
            });
        }
        // eslint-disable-next-line
    }, [newCall, waitUserAnswer]);

    const handleCall = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });
        peer.on('signal', (data) => {
            // socket.emit('callUser', data);
            const data2 = {
                sender: currentUser._id,
                receiver: ChatContent.receiver,
                signal: data,
            };
            handleCallToUser(data2);
        });
        peer.on('stream', (stream) => {
            userVideo.current.srcObject = stream;
        });
        socket.on('callAccepted', (signal) => {
            peer.signal(signal);
        });
    };

    const handleAcceptCall = () => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peer.on('signal', (data) => {
            socket.emit('answerCall', data);
        });
        peer.on('stream', (stream) => {
            userVideo.current.srcObject = stream;
        });
        peer.signal(callerSignal);
    };

    const handleEndCall = () => {
        handleDisplayCallVideo();
        handleInitCall(false);
    };

    return (
        <div className={cx('wrapper', { boderRadius10: true })}>
            <div className={cx('content')}>
                <div className={cx('main-screen', { boderRadius10: true })}>
                    {(waitUserAnswer || newCall) && (
                        <div className={cx('connecting-user')}>
                            <img className={cx('receiver-avatar')} src={caller.avatar} alt="avatar" />
                            <p className={cx('receiver-name')}>{caller.username}</p>
                            <span className={cx('status')}>{caller.notify}</span>
                        </div>
                    )}
                    {!waitUserAnswer && !newCall && (
                        <video
                            ref={userVideo}
                            className={cx('video', { boderRadius10: true })}
                            playsInline
                            muted
                            autoPlay
                            // src="meo.mp4"
                        ></video>
                    )}
                </div>
                <div className={cx('sub-screen', { boderRadius10: true })}>
                    <video
                        ref={myVideo}
                        className={cx('my-video', { boderRadius10: true })}
                        playsInline
                        muted
                        autoPlay
                    ></video>
                </div>
                <div className={cx('action-btns')}>
                    <div className={cx('item-btn')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faMicrophone} />
                    </div>
                    <div className={cx('item-btn')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faMicrophoneSlash} />
                    </div>
                    {(!initCall || newCall) && (
                        <div className={cx('item-btn', { accept: true })}>
                            <FontAwesomeIcon className={cx('icon')} icon={faPhone} onClick={handleAcceptCall} />
                        </div>
                    )}
                    {(initCall || newCall) && (
                        <div className={cx('item-btn', { reject: true })}>
                            <FontAwesomeIcon className={cx('icon')} icon={faPhone} onClick={handleEndCall} />
                        </div>
                    )}
                    <div className={cx('item-btn')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faVideo} />
                    </div>
                    <div className={cx('item-btn')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faVideoSlash} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(VideoCall);
