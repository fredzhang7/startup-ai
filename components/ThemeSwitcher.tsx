"use client";

import { useTheme } from "next-themes";
import Select from 'react-select';
import { SunIcon, MoonIcon, DevicePhoneMobileIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import "../styles/theme.css";

const themeOptions = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: DevicePhoneMobileIcon },
  { value: 'purple-dark', label: 'Purple Dark', icon: AdjustmentsHorizontalIcon },
];

const selectionStyles = {
  control: (provided: any) => ({
    ...provided,
    background: 'linear-gradient(90deg, rgba(255,223,189,1) 0%, rgba(255,233,210,1) 100%)',
    borderRadius: '0.7rem',
    padding: '0.25rem',
    border: 'none',
    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: '1px solid rgba(255, 223, 189, 0.5)',
    color: 'black',
    background: state.isSelected ? 'linear-gradient(90deg, rgba(255,223,189,1) 0%, rgba(255,233,210,1) 100%)' : 'white',
    padding: '0.5rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'black',
  }),
};

export const ThemeSwitcher = () => {
  let { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeChange = (selectedOption: any) => {
    const newTheme = selectedOption.value;
    document.body.classList.remove('dark', 'light', 'purple-dark');
    if (newTheme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDarkMode ? 'dark' : 'light');
    } else {
      setTheme(newTheme);
      if (newTheme === 'purple-dark') {
        const element = document.documentElement;
        element.style.colorScheme = 'purple-dark';
      }
    }
    document.body.classList.add(newTheme);
  };

  const formatOptionLabel = ({ value, label, icon: Icon }: any) => (
    <div className="flex items-center space-x-2">
      <Icon className={`h-5 w-5 ${value}`} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="top-0 left-0 m-2">
      <Select
        aria-label="Theme Selector"
        options={themeOptions}
        styles={selectionStyles}
        value={themeOptions.find(option => option.value === theme)}
        onChange={handleThemeChange}
        formatOptionLabel={formatOptionLabel}
        className="w-full max-w-[200px]"
      />
    </div>
  );
};