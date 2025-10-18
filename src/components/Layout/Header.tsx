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
    <header className="bg-white/98 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b-2 border-gray-100/50">
      <div className="container-professional">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 space-x-reverse cursor-pointer select-none group logo-container"
          >
            <img
              src="/image.png"
              alt="Only Best Logo"
              className="w-16 h-16 object-contain transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12 drop-shadow-2xl"
            />
            <span className="font-bold text-3xl bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 bg-clip-text text-transparent tracking-tight">Only Best</span>
            {logoClickCount > 0 && logoClickCount < 10 && (
              <span className="text-xs text-gray-400 mr-3 font-mono">
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
                className={`text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 ${
                  isActive(item.href) ? 'text-orange-600 font-semibold bg-orange-50 shadow-sm' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* WhatsApp Button */}
          <div className="hidden md:block">
            <a
              href={createWhatsAppUrl(businessInfo.phone, getWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact shadow-lg hover:shadow-xl"
            >
              <Phone className="w-4 h-4" />
              <span>צרו קשר</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="תפריט"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium px-4 py-3 rounded-xl hover:bg-orange-50 ${
                    isActive(item.href) ? 'text-orange-600 font-semibold bg-orange-50' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={createWhatsAppUrl(businessInfo.phone, getWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-success w-full justify-center mt-4 shadow-lg"
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