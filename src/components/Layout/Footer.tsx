import React from 'react';
import { Phone, Mail, MapPin, Clock, DoorOpen } from 'lucide-react';
import { createWhatsAppUrl, getWhatsAppMessage } from '../../utils/whatsapp';
import { useFirestore } from '../../hooks/useFirestore';
import { BusinessInfo } from '../../types';
import { businessInfo } from '../../data/business';

const Footer: React.FC = () => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const currentBusinessInfo = businessData[0] || businessInfo;

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <img 
                src="/image.png" 
                alt="Only Best Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-xl">Only Best</span>
            </div>
            <p className="text-gray-300 mb-4">
              דלתות איכות לבית ולעסק - בחירה מדויקת, התקנה מקצועית, שירות מהיר
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">פרטי קשר</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">{currentBusinessInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-orange-400" />
                <a
                  href={`tel:${currentBusinessInfo.phone}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {currentBusinessInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-orange-400" />
                <a
                  href={`mailto:${currentBusinessInfo.email}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {currentBusinessInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">{currentBusinessInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">קישורים מהירים</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white transition-colors duration-200">
                דף בית
              </a>
              <a href="/catalog" className="block text-gray-300 hover:text-white transition-colors duration-200">
                קטלוג דלתות
              </a>
              <a href="/about" className="block text-gray-300 hover:text-white transition-colors duration-200">
                אודות
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white transition-colors duration-200">
                צור קשר
              </a>
              <a
                href={createWhatsAppUrl(currentBusinessInfo.whatsapp, getWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 mt-4"
              >
                וואטסאפ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 שי מדלסי פיתוח אתרים . כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;