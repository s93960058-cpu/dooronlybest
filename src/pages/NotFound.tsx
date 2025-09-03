import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';
import { useFirestore } from '../hooks/useFirestore';
import { BusinessInfo } from '../types';

const NotFound: React.FC = () => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const businessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  const whatsappUrl = createWhatsAppUrl(businessInfo.whatsapp, getWhatsAppMessage());
  const whatsappUrl = createWhatsAppUrl(businessInfo.phone, getWhatsAppMessage());

  return (
    <>
      <Helmet>
        <title>דף לא נמצא - Only Best</title>
        <meta name="description" content="הדף שחיפשתם לא נמצא. חזרו לדף הבית או דפדפו בקטלוג הדלתות שלנו." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-blue-100 mb-4">404</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              הדף לא נמצא
            </div>
            <p className="text-lg text-gray-600 mb-8">
              מצטערים, הדף שחיפשתם לא קיים או הועבר למיקום אחר
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link
              to="/"
              className="flex flex-col items-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
            >
              <Home className="w-8 h-8 text-orange-600 mb-3" />
              <span className="font-semibold text-orange-800">דף הבית</span>
            </Link>

            <Link
              to="/catalog"
              className="flex flex-col items-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
            >
              <Search className="w-8 h-8 text-orange-600 mb-3" />
              <span className="font-semibold text-orange-800">קטלוג דלתות</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
              <span className="font-semibold text-green-800">וואטסאפ</span>
            </a>
          </div>

          {/* Popular Links */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">קישורים פופולריים</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Link to="/catalog" className="text-orange-600 hover:text-orange-800">
                כל הדלתות
              </Link>
              <Link to="/about" className="text-orange-600 hover:text-orange-800">
                אודות
              </Link>
              <Link to="/contact" className="text-orange-600 hover:text-orange-800">
                צור קשר
              </Link>
              <Link to="/reviews" className="text-orange-600 hover:text-orange-800">
                ביקורות
              </Link>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 bg-orange-800 text-white rounded-lg p-8">
            <h3 className="text-xl font-bold mb-4">צריכים עזרה?</h3>
            <p className="mb-6">
              אם אתם מחפשים משהו מסוים, אנחנו כאן לעזור לכם למצוא אותו
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                דברו איתנו בוואטסאפ
              </a>
              <a
                href={`tel:${businessInfo.phone}`}
                className="bg-white text-orange-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                התקשרו עכשיו
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;