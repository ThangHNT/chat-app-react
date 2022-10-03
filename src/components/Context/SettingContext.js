import { createContext, useState } from 'react';

const SettingContext = createContext();

const themeList = [
    { type: 'theme0' },
    { type: 'theme1' },
    { type: 'theme2' },
    { type: 'theme3' },
    { type: 'theme4' },
    { type: 'theme5' },
];

function SettingProvider({ children }) {
    // console.log('setting context');
    const [blockStatus, setBlockStatus] = useState('');
    const [darkLightMode, setDarkLightMode] = useState(false);
    const [displayTheme, setDisplayTheme] = useState();
    const [theme, setTheme] = useState(new Map());
    const [backgroundImage, setBackgroundImage] = useState([]);

    const handleSetBackgroundImage = (key, value) => {
        setBackgroundImage((pre) => {
            const newObj = {
                id: key,
                backgroundImage: value,
            };
            return [...pre, newObj];
        });
    };

    const handleSetTheme = (key, value) => {
        setTheme((pre) => {
            return pre.set(key, value);
        });
    };

    const handleDisplayThemeList = () => {
        setDisplayTheme((pre) => !pre);
    };

    const handlSetBlockStatus = (status) => {
        setBlockStatus(status);
    };

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
        handlSetBlockStatus,
        handleChangeDarkLightMode,
        handleDisplayThemeList,
        handleSetTheme,
        handleSetBackgroundImage,
    };
    return <SettingContext.Provider value={values}>{children}</SettingContext.Provider>;
}

export { SettingProvider, SettingContext };
