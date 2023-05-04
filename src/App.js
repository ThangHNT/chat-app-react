import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Account from '~/pages/Account';
import NotFound from '~/pages/NotFound';
import Admin from '~/pages/Admin';
import DecryptFile from '~/pages/DecryptFile';
import EncryptFile from '~/pages/EncryptFile';

function App() {
    // console.log('App');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/encrypt-file" element={<EncryptFile />} />
                <Route path="/decrypt-file" element={<DecryptFile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
