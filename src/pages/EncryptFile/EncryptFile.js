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
                const hiddenMessage = encrypt(text);
                const result = handleDivideAndReplace(plainText, hiddenMessage);
                // const result = plainText + '\n' + hiddenMessage;
                // console.log(result);
                setFile(result);
            };
        }
    };

    const handleDivideAndReplace = (plainText, encryptedMsg) => {
        plainText = plainText.trim();
        let parts = 2;
        let arrIndex = [];
        let plainTextArr = plainText.split('\n');
        // console.log(plainTextArr.length);
        plainTextArr.forEach((line, index) => {
            if (line.trim() === '') {
                parts += 1;
                arrIndex.push(index);
            }
        });
        let arr = encryptedMsg.split('\n');
        let hiddenMsgLength = arr.length;
        let part1 = Math.floor(hiddenMsgLength / parts);
        let part2 = hiddenMsgLength - (hiddenMsgLength - part1 * (parts - 1));
        let string = '';
        let b = [];
        for (let i = 0; i < parts - 1; i++) {
            let wp = arr.slice(i * part1, (i + 1) * part1);
            let str = wp.join('\n');
            // string += str + '\n';
            // if (i === 0) {
            //     plainTextArr.unshift(wp);
            // } else {
            //     console.log(str);
            //     plainTextArr.splice(arrIndex[i - 1] + parts * i, 0, wp);
            // }
            b.push(str);
        }
        let remainder = arr.slice(part2, hiddenMsgLength);

        let plainText2 = plainText.split('\n');
        let x = 1;
        plainText2.forEach((line, index) => {
            if (line.trim() === '') {
                console.log(b[x]);
                plainText2[index] = b[x];
            }
        });
        plainText2.unshift(b[0] + '\n');
        plainText2.push('\n' + remainder.join('\n'));
        console.log(plainText2.join(''));
        // plainTextArr.push(remainder.join('\n') + '\n');
        // decrypt(string);
        return plainText2.join('');
    };

    function decrypt(data) {
        let code = '';
        let text = '';
        // console.log(data);
        _.forEach(data.split(''), function (c) {
            switch (c) {
                case ' ':
                    code += '01';
                    break;
                case '\t':
                    code += '10';
                    break;
                case '\n':
                    code += '00';
                    break;
                case '\r':
                    code += '11';
                    break;
                default: {
                }
            }
            if (code.length === 8) {
                text += String.fromCharCode(parseInt(code, 2));
                code = '';
            }
        });
        text.trim();
        const bytes = CryptoJS.AES.decrypt(text, secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.log(originalText);
    }

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
