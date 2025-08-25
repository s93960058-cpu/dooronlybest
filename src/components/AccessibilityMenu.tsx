import React, { useState } from 'react';
import { Settings, Sun, Moon, Type, Eye, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode, fontSize, setFontSize, highContrast, toggleHighContrast } = useTheme();

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-r-lg shadow-lg z-50 transition-all duration-200"
        aria-label="תפריט נגישות"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                תפריט נגישות
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="text-gray-900 dark:text-white">
                    {isDarkMode ? 'מצב כהה' : 'מצב בהיר'}
                  </span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  <Type className="w-5 h-5" />
                  <span className="text-gray-900 dark:text-white">גודל טקסט</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        fontSize === size
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {size === 'small' ? 'קטן' : size === 'medium' ? 'בינוני' : 'גדול'}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Eye className="w-5 h-5" />
                  <span className="text-gray-900 dark:text-white">ניגודיות גבוהה</span>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setFontSize('medium');
                  if (isDarkMode) toggleDarkMode();
                  if (highContrast) toggleHighContrast();
                }}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
              >
                איפוס הגדרות
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityMenu;