import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const dict = {
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.societies': 'Societies', 'nav.notices': 'Notices',
    'nav.events': 'Events', 'nav.help': 'Help', 'nav.more': 'More', 'nav.services': 'Services & FAQ',
    'nav.raiseIssue': 'Raise an Issue', 'nav.resources': 'Resources', 'nav.committee': 'Committee',
    'nav.gallery': 'Gallery', 'nav.membership': 'Membership', 'nav.contact': 'Contact',
    'cta.join': 'Join the Federation', 'cta.raise': 'Raise an Issue', 'cta.viewAll': 'View all',
    'cta.learn': 'Learn more', 'cta.contact': 'Contact us',
    'hero.eyebrow': 'Housing societies · Chikhli & Moshi · Pune',
    'hero.title1': 'One united voice for',
    'hero.title2': 'Chikhli & Moshi',
    'hero.sub': 'The federation of housing societies and resident associations — working together on civic issues, legal support, safety and a better neighbourhood for every family.',
    'home.notices': 'Latest notices', 'home.events': 'Upcoming events', 'home.what': 'What we do',
    'home.whatSub': 'Practical help for societies, committees and residents.',
    'home.societies': 'Member societies', 'home.areas': 'Areas we serve',
    'home.ctaTitle': 'Is your society part of the federation?',
    'home.ctaSub': 'Stronger together: shared expertise, a louder voice with civic bodies, and a network that has your back.',
    'ad.label': 'Advertisement',
    'footer.quick': 'Quick links', 'footer.help': 'Help & support', 'footer.contact': 'Get in touch',
    'footer.about': 'A registered-style federation of housing societies working for residents of Chikhli and Moshi.',
  },
  mr: {
    'nav.home': 'मुख्यपृष्ठ', 'nav.about': 'आमच्याबद्दल', 'nav.societies': 'सोसायट्या', 'nav.notices': 'सूचना',
    'nav.events': 'कार्यक्रम', 'nav.help': 'मदत', 'nav.more': 'अधिक', 'nav.services': 'सेवा व प्रश्नोत्तरे',
    'nav.raiseIssue': 'तक्रार नोंदवा', 'nav.resources': 'संसाधने', 'nav.committee': 'कार्यकारिणी',
    'nav.gallery': 'छायाचित्रे', 'nav.membership': 'सभासदत्व', 'nav.contact': 'संपर्क',
    'cta.join': 'फेडरेशनमध्ये सहभागी व्हा', 'cta.raise': 'तक्रार नोंदवा', 'cta.viewAll': 'सर्व पहा',
    'cta.learn': 'अधिक जाणून घ्या', 'cta.contact': 'संपर्क साधा',
    'hero.eyebrow': 'गृहनिर्माण सोसायट्या · चिखली व मोशी · पुणे',
    'hero.title1': 'एकजुटीचा आवाज',
    'hero.title2': 'चिखली व मोशी',
    'hero.sub': 'गृहनिर्माण सोसायट्या आणि रहिवासी संघटनांचे फेडरेशन — नागरी प्रश्न, कायदेशीर मदत, सुरक्षा आणि प्रत्येक कुटुंबासाठी उत्तम परिसरासाठी एकत्र काम.',
    'home.notices': 'ताज्या सूचना', 'home.events': 'आगामी कार्यक्रम', 'home.what': 'आम्ही काय करतो',
    'home.whatSub': 'सोसायट्या, समित्या आणि रहिवाशांसाठी प्रत्यक्ष मदत.',
    'home.societies': 'सभासद सोसायट्या', 'home.areas': 'आमचा कार्यक्षेत्र परिसर',
    'home.ctaTitle': 'तुमची सोसायटी फेडरेशनची सभासद आहे का?',
    'home.ctaSub': 'एकत्र येऊ, ताकद वाढवू: तज्ज्ञांचे मार्गदर्शन, नागरी संस्थांशी संवादात बळ आणि भक्कम नेटवर्क.',
    'ad.label': 'जाहिरात',
    'footer.quick': 'जलद दुवे', 'footer.help': 'मदत व सहाय्य', 'footer.contact': 'संपर्क',
    'footer.about': 'चिखली व मोशी परिसरातील रहिवाशांसाठी कार्यरत गृहनिर्माण सोसायट्यांचे फेडरेशन.',
  },
};

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cmf-lang') || 'en'; } catch { return 'en'; }
  });
  useEffect(() => {
    try { localStorage.setItem('cmf-lang', lang); } catch { /* ignore */ }
    document.documentElement.lang = lang === 'mr' ? 'mr' : 'en';
  }, [lang]);
  const t = useCallback((k) => dict[lang][k] ?? dict.en[k] ?? k, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
