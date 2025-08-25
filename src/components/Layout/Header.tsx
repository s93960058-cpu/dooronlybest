import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, DoorOpen } from 'lucide-react';
import { businessInfo as defaultBusinessInfo } from '../../data/business';
import { createWhatsAppUrl, getWhatsAppMessage } from '../../utils/whatsapp';
import AdminLogin from '../AdminLogin';
import { useFirestore } from '../../hooks/useFirestore';
import { BusinessInfo } from '../../types';

const Header: React.FC = () => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const businessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const location = useLocation();

  const navigation = [
    { name: 'בית', href: '/' },
    { name: 'קטלוג', href: '/catalog' },
    { name: 'אודות', href: '/about' },
    { name: 'ביקורות', href: '/reviews' },
    { name: 'צור קשר', href: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoClick = () => {
    setLogoClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 10) {
        setShowAdminLogin(true);
        return 0;
      }
      return newCount;
    });
    
    // Reset counter after 3 seconds of inactivity
    setTimeout(() => setLogoClickCount(0), 3000);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 space-x-reverse cursor-pointer select-none"
          >
            <img 
              src="/image.png" 
              alt="Only Best Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-xl text-orange-800">Only Best</span>
            {logoClickCount > 0 && logoClickCount < 10 && (
              <span className="text-xs text-gray-400 mr-2">
                {logoClickCount}/10
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-gray-700 hover:text-orange-800 transition-colors duration-200 ${
                  isActive(item.href) ? 'text-orange-800 font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* WhatsApp Button */}
          <div className="hidden md:block">
            <a
              href={createWhatsAppUrl(businessInfo.whatsapp, getWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>צרו קשר</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="תפריט"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-700 hover:text-orange-800 transition-colors duration-200 ${
                    isActive(item.href) ? 'text-orange-800 font-semibold' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={createWhatsAppUrl(businessInfo.whatsapp, getWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 space-x-reverse transition-colors duration-200 w-full"
              >
                <Phone className="w-4 h-4" />
                <span>צרו קשר</span>
              </a>
            </nav>
          </div>
        )}
      </div>
      
      <AdminLogin 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
    </header>
  );
};

export default Header;