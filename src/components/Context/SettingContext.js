import { createContext, useState } from 'react';

const SettingContext = createContext();

function SettingProvider({ children }) {
    const [blockStatus, setBlockStatus] = useState('');

    const handlSetBlockStatus = (status) => {
        setBlockStatus(status);
    };

    const values = { blockStatus, handlSetBlockStatus };
    return <SettingContext.Provider value={values}>{children}</SettingContext.Provider>;
}

export { SettingProvider, SettingContext };
