import { createContext, useState } from 'react';

const SettingContext = createContext();

const themeList = [
    { type: 'theme0' },
    { type: 'theme1' },
    { type: 'theme2' },
    { type: 'theme3' },
    { type: 'theme4' },
    { type: 'theme5' },
    { type: 'theme6' },
    { type: 'theme7' },
    { type: 'theme8' },
    { type: 'theme9' },
    { type: 'theme10' },
    { type: 'theme11' },
    { type: 'theme12' },
    { type: 'theme13' },
    { type: 'theme14' },
];

function SettingProvider({ children }) {
    // console.log('setting context');
    const [blockStatus, setBlockStatus] = useState('');
    const [darkLightMode, setDarkLightMode] = useState(false);
    const [displayTheme, setDisplayTheme] = useState();
    const [theme, setTheme] = useState(new Map());
    const [backgroundImage, setBackgroundImage] = useState([]);
    const [displayRemoveMessageModal, setDisplayRemoveMessageModal] = useState(false);

    // hiện modal xóa tin nhắn
    const handleSetDisplayRemoveMessageModal = (data) => {
        setDisplayRemoveMessageModal((pre) => {
            return pre === false ? data : false;
        });
    };
    // thay đổi ảnh nền
    const handleSetBackgroundImage = (key, value) => {
        setBackgroundImage((pre) => {
            const newObj = {
                id: key,
                backgroundImage: value,
            };
            return [...pre, newObj];
        });
    };
    // chọn theme
    const handleSetTheme = (key, value) => {
        setTheme((pre) => {
            return pre.set(key, value);
        });
    };
    // hiển thị ds chủ đề theme
    const handleDisplayThemeList = () => {
        setDisplayTheme((pre) => !pre);
    };

    // set tình trạng chặn
    const handlSetBlockStatus = (status) => {
        setBlockStatus(status);
    };

    // chuyển đổi giao diện sáng tối
    const handleChangeDarkLightMode = () => {
        setDarkLightMode((pre) => !pre);
    };

    const values = {
        themeList,
        blockStatus,
        theme,
        displayTheme,
        darkLightMode,
        backgroundImage,
        displayRemoveMessageModal,
        handlSetBlockStatus,
        handleChangeDarkLightMode,
        handleDisplayThemeList,
        handleSetTheme,
        handleSetBackgroundImage,
        handleSetDisplayRemoveMessageModal,
    };
    return <SettingContext.Provider value={values}>{children}</SettingContext.Provider>;
}

export { SettingProvider, SettingContext };
