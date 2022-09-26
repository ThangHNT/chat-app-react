import { createContext, useState } from 'react';

const SettingContext = createContext();

const themeList = [
    { kind: 'default-theme' },
    { kind: 'theme1' },
    { kind: 'theme2' },
    { kind: 'theme3' },
    { kind: 'theme4' },
    { kind: 'theme5' },
];

function SettingProvider({ children }) {
    // console.log('setting context');
    const [blockStatus, setBlockStatus] = useState('');
    const [darkLightMode, setDarkLightMode] = useState(false);
    const [displayTheme, setDisplayTheme] = useState();
    const [theme, setTheme] = useState(0);

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
