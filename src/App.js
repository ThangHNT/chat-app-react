import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Account from '~/pages/Account';

function App() {
    // console.log('App');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
