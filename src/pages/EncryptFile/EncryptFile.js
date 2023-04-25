import Header from '~/layouts/Header/Header';
import styles from './EncryptFile.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import CryptoJS from 'crypto-js';
import _ from 'lodash';

const cx = classNames.bind(styles);
const secretKey = 'chat-app-hnt-secret-key';

function EncryptFile() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);

    function binary(char) {
        return _.padStart(char.charCodeAt(0).toString(2), 8, '0');
    }

    function encrypt(data) {
        const ciphertext = CryptoJS.AES.encrypt(data, secretKey, 128).toString();
        // console.log(ciphertext, ciphertext.length);
        let lines = ciphertext.replace(/\r/g, '').split('\n');
        lines.map((e) => e.trim()); // trim whitespace
        lines = _.compact(lines); // remove empty values

        let out = [];
        _.forEach(lines, function (line) {
            let chars = line.split('');
            _.forEach(chars, function (char) {
                out.push(binary(char));
            });
            out.push(binary('\n'));
        });

        let write = '';
        let log = '';
        _.forEach(out.join('').match(/.{1,2}/g), function (b) {
            switch (b) {
                case '01':
                    write += ' ';
                    log += 's';
                    break;
                case '10':
                    write += '\t';
                    log += 't';
                    break;
                case '00':
                    write += '\n';
                    log += 'n';
                    break;
                case '11':
                    write += '\r';
                    log += 'r';
                    break;
                default:
                    return '';
            }
        });
        return write;
    }

    const handleSelectFile = (e) => {
        const reader = new FileReader();
        if (e.target.files && text.length > 0) {
            let file = e.target.files[0];
            // reader.readAsDataURL(file);
            reader.readAsText(file);
            reader.onload = () => {
                let plainText = reader.result.trim();
                let parts = 2;
                plainText.split('\n').forEach((line) => {
                    if (line.trim() === '') {
                        parts += 1;
                    }
                });
                console.log(parts);
                // const hiddenMessage = encrypt(text);
                // plainText.trim();
                // const result = plainText + '\n' + hiddenMessage;
                // console.log(result);
                setFile(result);
            };
        }
    };

    const handleChangeInput = (e) => {
        const value = e.currentTarget.value;
        setText(value);
    };

    const handleGetResult = () => {
        setResult(true);
    };

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('body')}>
                <div>
                    <textarea
                        className={cx('textarea')}
                        onChange={handleChangeInput}
                        value={text}
                        placeholder="Nhập thông điệp"
                    ></textarea>
                </div>
                <div>
                    <label className={cx('label')} htmlFor="file">
                        Chọn file để giấu tin
                    </label>
                    <input onChange={handleSelectFile} className={cx('input-file')} id="file" type="file"></input>
                </div>
                <div className={cx('result')}>
                    {file && (
                        <span className={cx('encrypt-btn')} onClick={handleGetResult}>
                            Start
                        </span>
                    )}
                    {result && (
                        <a href={`data:attachment/text,${encodeURIComponent(file)}`} download={'encryted file.txt'}>
                            Download file
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EncryptFile;
