import Navigation from '../components/Navigation';
import Footer from './Footer';
import Header from '@/components/Header';

function Layout({ children }) {
  return (
    <>
      
      <div className="container">
        <Navigation />
        {children}
        <Footer />
      </div>
    </>
  );
}

export default Layout;
