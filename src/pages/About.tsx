import React from 'react';
import { MapPin, Clock, Phone, Mail, Users, Award, Shield, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import { useFirestore } from '../hooks/useFirestore';
import { BusinessInfo } from '../types';

const About: React.FC = () => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const businessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  return (
    <>
      <Helmet>
        <title>אודות Only Best -הכי טוב לבית שלך</title>
        <meta name="description" content="Only Best - חברה מובילה בתחום הדלתות מאז 2010. מתמחים בדלתות פלדה, עץ, זכוכית וביטחון. התקנה מקצועית, אחריות מלאה ושירות אמין." />
        <meta name="keywords" content="אודות Only Best, חברת דלתות, התקנת דלתות, ערד, מקצועיות, ניסיון" />
        <meta property="og:title" content="אודות Only Best - מתמחים בדלתות איכות מ-2010" />
        <meta property="og:description" content="Only Best - חברה מובילה בתחום הדלתות מאז 2010. מתמחים בדלתות פלדה, עץ, זכוכית וביטחון." />
        <meta property="og:image" content="/image.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            אודות Only Best
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            מאז 2025 אנחנו מספקים פתרונות דלתות מתקדמים ואיכותיים לבתים ולעסקים בכל הארץ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Story */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">הסיפור שלנו</h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-4">
              <p>
                Only Best נולדה מתוך החזון לספק לכל בית ועסק בישראל דלתות באיכות הגבוהה ביותר, 
                עם שירות מקצועי ויחס אישי לכל לקוח.
              </p>
              <p>
                עם הדלתות הכי איכותיות בשוק, אנחנו מתמחים בכל סוגי הדלתות - מדלתות פנימיות עדינות 
                ועד דלתות מעוצבות. הצוות המקצועי שלנו זמין כדי להבטיח 
                את השירות הטוב ביותר.
              </p>
              <p>
                המחויבות שלנו היא פשוטה: לספק למעלה מהצפוי, בזמן ובאיכות ללא פשרות. 
                כל דלת שאנחנו מתקינים היא ביטוי של המקצועיות והנאמנות שלנו ללקוחות.
              </p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">הערכים שלנו</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full ml-4">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">איכות ללא פשרות</h3>
                  <p className="text-gray-600">
                    אנחנו עובדים רק עם יצרנים מובילים ומקפידים על בקרת איכות קפדנית בכל שלב
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full ml-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">שירות אישי</h3>
                  <p className="text-gray-600">
                 זמינים תמיד לתת מענה באהבה גדןלה
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full ml-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">אמינות ובטחון</h3>
                  <p className="text-gray-600">
                    התקנה מקצועית, אחריות מלאה ושירות לאחר המכירה למגורים ולעסקים
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full ml-4">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">מצוינות בביצוע</h3>
                  <p className="text-gray-600">
                    מאות לקוחות מרוצים ומערכת יחסים ארוכת טווח הבנויה על אמון ושביעות רצון
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-orange-50 rounded-xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-800 mb-2">1+</div>
              <div className="text-gray-600">שנות ניסיון</div>
            </div>
            
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-800 mb-2">500+</div>
              <div className="text-gray-600">לקוחות מרוצים</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-800 mb-2">24/7</div>
              <div className="text-gray-600">תמיכה זמינה</div>
            </div>
          </div>
        </div>

        {/* Contact Info & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Business Details */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">פרטי העסק</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-orange-600 ml-4" />
                <div>
                  <div className="font-semibold text-gray-900">כתובת</div>
                  <div className="text-gray-600">{businessInfo.address}</div>
                  <a
                    href={`https://maps.google.com/search/?api=1&query=${encodeURIComponent(businessInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 text-sm mt-1 inline-block"
                  >
                    פתח בגוגל מפות
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-6 h-6 text-orange-600 ml-4" />
                <div>
                  <div className="font-semibold text-gray-900">טלפון</div>
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="w-6 h-6 text-orange-600 ml-4" />
                <div>
                  <div className="font-semibold text-gray-900">אימייל</div>
                  <a
                    href={`mailto:${businessInfo.email}`}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    {businessInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-6 h-6 text-orange-600 ml-4" />
                <div>
                  <div className="font-semibold text-gray-900">שעות פעילות</div>
                  <div className="text-gray-600">{businessInfo.hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-8">
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
    </>
  );
};

export default About;