'use client';

import React, { useState, useCallback, memo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ColorPicker from './ColorPicker';
import './Settings.css';

const Settings: React.FC = memo(() => {
  const {
    currentTheme,
    isDarkMode,
    selectedColorScheme,
    customPrimaryColor,
    toggleDarkMode,
    setColorScheme,
    setCustomPrimaryColor,
    availableColorSchemes
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleSettings = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleColorSchemeChange = useCallback((schemeName: string) => {
    setColorScheme(schemeName);
  }, [setColorScheme]);

  return (
    <div className="settings-container">
      <button 
        className="settings-toggle"
        onClick={toggleSettings}
        aria-label={isOpen ? 'Close settings' : 'Open settings'}
      >
        <span className="settings-icon">⚙️</span>
        <span className="settings-text">Settings</span>
        <span className={`settings-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="settings-panel">
          <div className="settings-section">
            <h3 className="settings-title">Appearance</h3>
            
            {/* Dark/Light Mode Toggle */}
            <div className="setting-item">
              <label className="setting-label">
                <span>Dark Mode</span>
                <div className="toggle-container">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
            
            {/* Color Scheme Selection */}
            <div className="setting-item">
              <span className="setting-label">Preset Themes</span>
              <div className="color-schemes">
                {availableColorSchemes.map((scheme) => (
                  <button
                    key={scheme.name}
                    className={`color-scheme-btn ${
                      selectedColorScheme === scheme.name && !customPrimaryColor ? 'active' : ''
                    }`}
                    onClick={() => handleColorSchemeChange(scheme.name)}
                    title={scheme.name}
                  >
                    <div className="color-preview">
                      <div 
                        className="color-dot primary"
                        style={{ backgroundColor: scheme.primary }}
                      ></div>
                      <div 
                        className="color-dot secondary"
                        style={{ backgroundColor: scheme.secondary }}
                      ></div>
                      <div 
                        className="color-dot accent"
                        style={{ backgroundColor: scheme.accent }}
                      ></div>
                    </div>
                    <span className="scheme-name">{scheme.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Color Picker */}
            <div className="setting-item">
              <ColorPicker 
                currentColor={customPrimaryColor || currentTheme.colors.primary}
                onColorSelect={setCustomPrimaryColor}
              />
            </div>
            
            {/* Current Theme Info */}
            <div className="setting-item">
              <div className="theme-info">
                <h4>Current Theme</h4>
                <p className="theme-name">
                  {customPrimaryColor ? 'Custom Color Theme' : currentTheme.name}
                </p>
                <div className="theme-colors">
                  <div 
                    className="theme-color-sample"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                    title="Primary Color"
                  ></div>
                  <div 
                    className="theme-color-sample"
                    style={{ backgroundColor: currentTheme.colors.secondary }}
                    title="Secondary Color"
                  ></div>
                  <div 
                    className="theme-color-sample"
                    style={{ backgroundColor: currentTheme.colors.accent }}
                    title="Accent Color"
                  ></div>
                </div>
                {customPrimaryColor && (
                  <div className="custom-color-info">
                    <span className="custom-color-label">Custom Primary: </span>
                    <span className="custom-color-value">{customPrimaryColor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Settings.displayName = 'Settings';

export default Settings;