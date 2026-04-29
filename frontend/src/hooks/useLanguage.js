import { useState, useEffect } from 'react';

const validLanguages = ['en', 'hi'];

export function useLanguage() {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('language');
    return validLanguages.includes(saved) ? saved : 'en';
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'language' && validLanguages.includes(e.newValue)) {
        setLanguageState(e.newValue);
      }
    };
    
    const handleLocalChange = (e) => {
        if (validLanguages.includes(e.detail)) {
            setLanguageState(e.detail);
        }
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleLocalChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('languageChange', handleLocalChange);
    }
  }, []);

  const setLanguage = (lang) => {
    if (validLanguages.includes(lang)) {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
      window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
    }
  };

  return { language, setLanguage };
}
