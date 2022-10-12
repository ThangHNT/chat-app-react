import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import MyAccount from '~/pages/MyAccount';

function App() {
    // console.log('App');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<MyAccount />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
