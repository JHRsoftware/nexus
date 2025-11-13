'use client';

import React, { useState } from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor);

  // Beautiful color palette with various shades
  const colorPalette = [
    // Blues
    '#3498db', '#2980b9', '#1abc9c', '#16a085', '#2c3e50', '#34495e',
    // Purples & Pinks
    '#9b59b6', '#8e44ad', '#e74c3c', '#c0392b', '#e91e63', '#ad1457',
    // Greens
    '#27ae60', '#229954', '#2ecc71', '#1e8449', '#00e676', '#00c853',
    // Oranges & Yellows
    '#e67e22', '#d35400', '#f39c12', '#e18700', '#ff9800', '#f57c00',
    // Reds
    '#e74c3c', '#c0392b', '#f44336', '#d32f2f', '#ff5722', '#e64a19',
    // Teals & Cyans
    '#1abc9c', '#16a085', '#00bcd4', '#0097a7', '#009688', '#00695c',
    // Deep Colors
    '#795548', '#5d4037', '#607d8b', '#455a64', '#424242', '#212121',
    // Bright Colors
    '#ff4081', '#e040fb', '#7c4dff', '#536dfe', '#448aff', '#40c4ff',
    // Warm Colors
    '#ff6f00', '#ff8f00', '#ffa000', '#ffb300', '#ffc107', '#ffca28',
    // Cool Colors
    '#00e5ff', '#00b0ff', '#0091ea', '#2196f3', '#1976d2', '#0d47a1'
  ];

  const handleColorClick = (color: string) => {
    setCustomColor(color);
    onColorSelect(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorSelect(color);
  };

  return (
    <div className="color-picker-container">
      <div className="color-picker-header">
        <span className="color-picker-label">Custom Color</span>
        <button 
          className="color-picker-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div 
            className="current-color-preview"
            style={{ backgroundColor: currentColor }}
          ></div>
          <span className={`picker-arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </button>
      </div>
      
      {isOpen && (
        <div className="color-picker-panel">
          {/* Color Palette Grid */}
          <div className="color-palette-section">
            <h4 className="palette-title">Color Palette</h4>
            <div className="color-palette-grid">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  className={`palette-color ${currentColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          {/* Custom Color Input */}
          <div className="custom-color-section">
            <h4 className="custom-title">Custom Color</h4>
            <div className="custom-color-input-group">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="custom-color-input"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (e.target.value.match(/^#[0-9A-F]{6}$/i)) {
                    onColorSelect(e.target.value);
                  }
                }}
                className="custom-color-text"
                placeholder="#3498db"
                pattern="^#[0-9A-F]{6}$"
              />
            </div>
          </div>
          
          {/* Recent Colors */}
          <div className="recent-colors-section">
            <h4 className="recent-title">Quick Colors</h4>
            <div className="recent-colors">
              {['#3498db', '#9b59b6', '#27ae60', '#e67e22', '#e74c3c', '#1abc9c'].map((color, index) => (
                <button
                  key={index}
                  className={`recent-color ${currentColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;