import React, { useState } from 'react';

const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useState<'bn' | 'en'>(
    (localStorage.getItem('lang') as 'bn' | 'en') || 'bn'
  );

  const onChange = (value: 'bn' | 'en') => {
    setLanguage(value);
    localStorage.setItem('lang', value);
    // Optionally trigger re-render via custom event or context in the future
  };

  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value as 'bn' | 'en')}
      className="border rounded-md px-2 py-1 text-sm"
      aria-label="Language selector"
    >
      <option value="bn">বাংলা</option>
      <option value="en">English</option>
    </select>
  );
};

export default LanguageSwitcher;
