import Header from '~/layouts/Header';
import HomeContent from '~/layouts/HomeContent';

function Home() {
    return (
        <>
            <Header currentUser />
            <HomeContent />
        </>
    );
}

export default Home;
