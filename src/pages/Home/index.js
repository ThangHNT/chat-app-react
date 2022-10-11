import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '~/layouts/Header';
import HomeContent from '~/layouts/HomeContent';

function Home() {
    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            document.querySelector('html').classList.remove('darkmode');
            navigate('/login');
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header />
            <HomeContent />
        </>
    );
}

export default Home;
