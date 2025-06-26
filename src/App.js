import About from './components/About';
import Services from './components/Services';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import WorkProcess from './components/WorkProcess';
import Paper from './components/Paper';
import TelegramChannels from './components/TelegramChannels';
import Gallery from './components/Gallery';
import Sponsors from './components/Sponsors';
import ContactForm from './components/ContactForm';
import Navbar from './components/Navbar';
import Reviews from './components/Reviews';

function App() {
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      <HeroBanner />
      <WorkProcess />
      <Paper />
      <TelegramChannels />
      <Gallery />
      <About />
      <Sponsors />
      <Services />
      <Reviews />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
