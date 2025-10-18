import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { createWhatsAppUrl, getWhatsAppMessage } from '../../utils/whatsapp';
import { useFirestore } from '../../hooks/useFirestore';
import { BusinessInfo } from '../../types';
import { businessInfo } from '../../data/business';

const Footer: React.FC = () => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const currentBusinessInfo = businessData[0] || businessInfo;

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-transparent to-amber-900/10"></div>
      <div className="container-professional relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 space-x-reverse mb-6 group">
              <img
                src="/image.png"
                alt="Only Best Logo"
                className="w-12 h-12 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12"
              />
              <span className="font-bold text-2xl bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">Only Best</span>
            </div>
            <p className="text-gray-300 mb-4 text-lg leading-relaxed">
              דלתות איכות לבית ולעסק - בחירה מדויקת, התקנה מקצועית, שירות מהיר
            </p>
            <div className="flex gap-2 mt-6">
              <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              <div className="w-4 h-1 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full"></div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">פרטי קשר</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse group hover:translate-x-2 transition-transform duration-300">
                <MapPin className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                <span className="text-gray-300">{currentBusinessInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse group hover:translate-x-2 transition-transform duration-300">
                <Phone className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                <a
                  href={`tel:${currentBusinessInfo.phone}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {currentBusinessInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse group hover:translate-x-2 transition-transform duration-300">
                <Mail className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                <a
                  href={`mailto:${currentBusinessInfo.email}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {currentBusinessInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse group hover:translate-x-2 transition-transform duration-300">
                <Clock className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                <span className="text-gray-300">{currentBusinessInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">קישורים מהירים</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-orange-300 transition-all duration-300 text-lg hover:translate-x-2 transform">
                דף בית
              </a>
              <a href="/catalog" className="block text-gray-300 hover:text-orange-300 transition-all duration-300 text-lg hover:translate-x-2 transform">
                קטלוג דלתות
              </a>
              <a href="/about" className="block text-gray-300 hover:text-orange-300 transition-all duration-300 text-lg hover:translate-x-2 transform">
                אודות
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-orange-300 transition-all duration-300 text-lg hover:translate-x-2 transform">
                צור קשר
              </a>
              <a
                href={createWhatsAppUrl(currentBusinessInfo.whatsapp, getWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-300 mt-6 shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 font-semibold"
              >
                <MessageCircle className="w-5 h-5" />
                וואטסאפ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-12 pt-10 text-center">
          <p className="text-gray-400 text-lg">
            © 2025 האתר פותח ע"י שי מדלסי פיתוח אתרים • כל הזכויות שמורות
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Only Best - המומחים בדלתות איכותיות
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;