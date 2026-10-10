import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Village from './pages/Village';
import Agriculture from './pages/Agriculture';
import Events from './pages/Events';
import Youth from './pages/Youth';
import People from './pages/People';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import StaticPage from './pages/StaticPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/village" element={<Village />} />
              <Route path="/agriculture" element={<Agriculture />} />
              <Route path="/events" element={<Events />} />
              <Route path="/youth" element={<Youth />} />
              <Route path="/people" element={<People />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<StaticPage title="Privacy Policy"><p>Placeholder privacy policy — replace with the village panchayat's actual policy.</p></StaticPage>} />
              <Route path="/terms" element={<StaticPage title="Terms"><p>Placeholder terms of use — replace with the village panchayat's actual terms.</p></StaticPage>} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
