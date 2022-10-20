import { useContext, useEffect, useState, useRef, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faPhone, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import Peer from 'simple-peer';
import classNames from 'classnames/bind';
import styles from './VideoCall.module.scss';
import { SocketContext } from '~/components/Context/SocketContext';

const cx = classNames.bind(styles);

function VideoCall() {
    const { socket } = useContext(SocketContext);
    const [callerSignal, setCallerSignal] = useState();
    const [stream, setStream] = useState();
    const myVideo = useRef();
    const userVideo = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        });
        if (socket) {
            socket.on('callUser', (data) => {
                setCallerSignal(data);
            });
        }
    }, [socket]);

    const handleCall = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });
        peer.on('signal', (data) => {
            socket.emit('callUser', data);
        });
        peer.on('stream', (stream) => {
            userVideo.current.srcObject = stream;
        });
        socket.on('callAccepted', (signal) => {
            peer.signal(signal);
        });
    };

    const handlClickAnswer = () => {
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

    return (
        <div className={cx('wrapper', { boderRadius10: true })}>
            <div className={cx('content')}>
                <div className={cx('main-screen', { boderRadius10: true })}>
                    <video
                        ref={myVideo}
                        className={cx('video', { boderRadius10: true })}
                        playsInline
                        muted
                        autoPlay
                        src="meo.mp4"
                    ></video>
                </div>
                <div className={cx('sub-screen', { boderRadius10: true })}>
                    <video
                        ref={userVideo}
                        className={cx('video', { boderRadius10: true })}
                        playsInline
                        muted
                        autoPlay
                        src="meo.mp4"
                    ></video>
                </div>
                <div className={cx('action-btns')}>
                    <div className={cx('item-btn')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faMicrophone} />
                        <FontAwesomeIcon className={cx('icon')} icon={faMicrophoneSlash} />
                    </div>
                    <div className={cx('item-btn')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faPhone} />
                    </div>
                    <div className={cx('item-btn')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faVideo} />
                        <FontAwesomeIcon className={cx('icon')} icon={faVideoSlash} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(VideoCall);
