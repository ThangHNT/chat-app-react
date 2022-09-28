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
    const [theme, setTheme] = useState('0');

    const handleDisplayThemeList = () => {
        setDisplayTheme((pre) => !pre);
    };

    const handleSetTheme = (theme) => {
        setTheme(theme);
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
        handlSetBlockStatus,
        handleChangeDarkLightMode,
        handleDisplayThemeList,
        handleSetTheme,
    };
    return <SettingContext.Provider value={values}>{children}</SettingContext.Provider>;
}

export { SettingProvider, SettingContext };
