import Header from '~/layouts/Header/Header';
import styles from './DecryptFile.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import CryptoJS from 'crypto-js';
import _ from 'lodash';

const cx = classNames.bind(styles);

function DecryptFile() {
    const [file, setFile] = useState(null);
    const secretKey = 'chat-app-hnt-secret-key';

    function decrypt(data) {
        let code = '';
        let text = '';
        let idx = 0;
        for (let i = data.length - 1; i >= 0; i--) {
            if (' \t\n\r\v'.indexOf(data[i]) === -1) {
                idx = i + 3;
                break;
            }
        }
        // for (let i = 0; i < data.split('').length; i++) {
        //     if (!data[i].includes(' ')) {
        //         console.log(data[i]);
        //         idx = i;
        //         break;
        //     }
        // }
        let encryptText = data.slice(idx + 1, data.length - 1);
        console.log(encryptText);
        _.forEach(encryptText.split(''), function (c) {
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
        return text.trim();
    }

    const handleSelectFile = (e) => {
        const reader = new FileReader();
        if (e.target.files) {
            let file = e.target.files[0];
            // reader.readAsDataURL(file);
            reader.readAsText(file);
            reader.onload = () => {
                let plainText = reader.result.toString();
                plainText = decrypt(reader.result);
                const bytes = CryptoJS.AES.decrypt(plainText, secretKey);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);
                console.log(originalText);
                setFile(originalText);
            };
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('body')}>
                <div>
                    <label className={cx('label')} htmlFor="file">
                        Select file to decrypt:
                    </label>
                    <input onChange={handleSelectFile} className={cx('input-file')} id="file" type="file"></input>
                </div>
                <div>
                    {file && (
                        <textarea
                            className={cx('textarea')}
                            disabled
                            onChange={handleSelectFile}
                            value={file}
                        ></textarea>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DecryptFile;
