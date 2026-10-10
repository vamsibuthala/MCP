import { createContext, useContext, useState, useMemo } from 'react';

const STRINGS = {
  en: {
    nav_home: 'Home', nav_about: 'About', nav_village: 'Our Village', nav_agriculture: 'Agriculture',
    nav_events: 'Events', nav_youth: 'Youth', nav_people: 'Our People', nav_services: 'Services', nav_gallery: 'Gallery',
    nav_announcements: 'Announcements', nav_contact: 'Contact', explore: 'Explore Our Village', get_started: 'Get Started',
    hero_title: 'Welcome to Mallelacheruvu Palli', hero_sub: 'Our Village • Our People • Our Pride',
    view_gallery: 'View Gallery', know_more: 'Know More',
  },
  te: {
    nav_home: 'హోమ్', nav_about: 'గురించి', nav_village: 'మా గ్రామం', nav_agriculture: 'వ్యవసాయం',
    nav_events: 'కార్యక్రమాలు', nav_youth: 'యువత', nav_people: 'మా ప్రజలు', nav_services: 'సేవలు', nav_gallery: 'గ్యాలరీ',
    nav_announcements: 'ప్రకటనలు', nav_contact: 'సంప్రదించండి', explore: 'మా గ్రామాన్ని చూడండి', get_started: 'ప్రారంభించండి',
    hero_title: 'మల్లెచెరువు పల్లికి స్వాగతం', hero_sub: 'మా గ్రామం • మా ప్రజలు • మా గర్వం',
    view_gallery: 'గ్యాలరీ చూడండి', know_more: 'మరింత తెలుసుకోండి',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const value = useMemo(() => ({
    lang,
    setLang,
    t: (key) => STRINGS[lang][key] || STRINGS.en[key] || key,
  }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
