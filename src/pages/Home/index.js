import { useContext, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '~/layouts/Header';
import HomeContent from '~/layouts/HomeContent';
import { UserContext } from '~/components/Context/UserContext';

function Home() {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!currentUser) {
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
