import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';
import { useFirestore } from '../hooks/useFirestore';
import { BusinessInfo } from '../types';

const Contact: React.FC = () => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const businessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'התעניינות',
    message: '',
    agreed_to_terms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firebase
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        created_at: Timestamp.now(),
        status: 'new'
      });
      
      console.log('Form submitted:', formData);
      alert('תודה על פנייתכם! נחזור אליכם בהקדם האפשרי');
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'התעניינות',
        message: '',
        agreed_to_terms: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('שגיאה בשליחת הטופס. אנא נסו שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = createWhatsAppUrl(businessInfo.whatsapp, getWhatsAppMessage('contact'));

  return (
    <>
      <Helmet>
        <title>צור קשר - Only Best | יעוץ מקצועי והצעת מחיר חינם</title>
        <meta name="description" content="צרו קשר עם Only Best לקבלת יעוץ מקצועי והצעת מחיר חינם. כתובת: יהודה 6, ערד. טלפון: 058-3522191. שעות פעילות: ראשון-חמישי 09:00-18:00" />
        <meta name="keywords" content="צור קשר, יעוץ דלתות, הצעת מחיר, Only Best, ערד" />
        <meta property="og:title" content="צור קשר - Only Best" />
        <meta property="og:description" content="צרו קשר עם Only Best לקבלת יעוץ מקצועי והצעת מחיר חינם. התקנה מקצועית ושירות מהיר." />
        <meta property="og:image" content="/image.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            צרו קשר
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            נשמח לעזור לכם למצוא את הדלת המושלמת. צרו קשר לקבלת יעוץ מקצועי והצעת מחיר חינם
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">שלחו לנו הודעה</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="050-1234567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    אימייל (אופציונלי)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    נושא *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="התעניינות">התעניינות כללית</option>
                    <option value="הצעת מחיר">בקשה להצעת מחיר</option>
                    <option value="שירות">שירות לאחר המכירה</option>
                    <option value="תלונה">תלונה</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    הודעה *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="פרטו על הצרכים שלכם..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreed_to_terms"
                    name="agreed_to_terms"
                    checked={formData.agreed_to_terms}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded ml-2"
                  />
                  <label htmlFor="agreed_to_terms" className="text-sm text-gray-700">
                    אני מסכים לתנאי שימוש ומדיניות פרטיות *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-800 hover:bg-orange-900 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">יצירת קשר ישירה</h2>
              
              <div className="space-y-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <MessageCircle className="w-6 h-6 text-green-600 ml-3" />
                  <div>
                    <div className="font-semibold text-green-800">וואטסאפ</div>
                    <div className="text-sm text-green-600">תגובה מהירה</div>
                  </div>
                </a>

                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                >
                  <Phone className="w-6 h-6 text-orange-600 ml-3" />
                  <div>
                    <div className="font-semibold text-orange-800">{businessInfo.phone}</div>
                    <div className="text-sm text-orange-600">התקשרו עכשיו</div>
                  </div>
                </a>

                <a
                  href={`mailto:${businessInfo.email}`}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Mail className="w-6 h-6 text-gray-600 ml-3" />
                  <div>
                    <div className="font-semibold text-gray-800">{businessInfo.email}</div>
                    <div className="text-sm text-gray-600">שלחו אימייל</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">פרטי העסק</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-gray-600 ml-3 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">כתובת</div>
                    <div className="text-gray-600">{businessInfo.address}</div>
                    <a
                      href={`https://maps.google.com/search/?api=1&query=${encodeURIComponent(businessInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-800 text-sm"
                    >
                      פתח בגוגל מפות
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-gray-600 ml-3 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">שעות פעילות</div>
                    <div className="text-gray-600">{businessInfo.hours}</div>
                    <div className="text-sm text-gray-500">שישי-שבת: סגור</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">מיקום</h2>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={`https://maps.google.com/maps?width=100%&height=100%&hl=he&q=${encodeURIComponent(businessInfo.address)}&ie=UTF8&t=&z=14&iwloc=B&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מיקום Only Best"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;