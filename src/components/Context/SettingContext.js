import { createContext, useState } from 'react';

const SettingContext = createContext();

function SettingProvider({ children }) {
    // console.log('setting context');
    const [blockStatus, setBlockStatus] = useState('');
    const [darkLightMode, setDarkLightMode] = useState(false);

    const handlSetBlockStatus = (status) => {
        setBlockStatus(status);
    };

    const handleChangeDarkLightMode = () => {
        setDarkLightMode((pre) => !pre);
    };

    const values = { blockStatus, darkLightMode, handlSetBlockStatus, handleChangeDarkLightMode };
    return <SettingContext.Provider value={values}>{children}</SettingContext.Provider>;
}

export { SettingProvider, SettingContext };
