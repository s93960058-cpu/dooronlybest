import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Award, Users, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { DoorCard } from '../components/DoorCard';
import DoorCarousel from '../components/DoorCarousel';
import ReviewCard from '../components/ReviewCard';
import { reviewsData } from '../data/reviews';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';
import { useFirestore } from '../hooks/useFirestore';
import { Door, BusinessInfo } from '../types';
import { doorsData as defaultDoorsData } from '../data/doors';

const Home: React.FC = () => {
  const { data: firebaseDoors, loading: doorsLoading } = useFirestore<Door>('doors');
  const { data: businessData, loading: businessLoading } = useFirestore<BusinessInfo>('business');
  
  // Use Firebase data if available, otherwise fallback to default data
  const doorsData = firebaseDoors.length > 0 ? firebaseDoors : defaultDoorsData;
  const currentBusinessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;
  
  const featuredDoors = doorsData
    .filter(door => door.is_active)
    .sort((a, b) => (b.display_priority || 0) - (a.display_priority || 0))
    .slice(0, 6);
    
  const latestReviews = reviewsData
    .filter(review => review.approved)
    .slice(0, 3);

  const whatsappUrl = createWhatsAppUrl(currentBusinessInfo.whatsapp, getWhatsAppMessage());

  return (
    <>
      <Helmet>
        <title>Only Best - דלתות איכות לבית ולעסק | התקנה מקצועית ושירות מהיר</title>
        <meta name="description" content="Only Best מתמחה בדלתות איכות לבית ולעסק. בחירה מדויקת, התקנה מקצועית, שירות מהיר. קטלוג עשיר של דלתות פלדה, עץ, זכוכית וביטחון." />
        <meta name="keywords" content="דלתות, דלת פלדה, דלת עץ, דלת ביטחון, התקנת דלתות, ערד, Only Best" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Only Best",
            "url": "https://onlybest.co.il",
            "telephone": currentBusinessInfo.phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "יהודה 6",
              "addressLocality": "ערד",
              "addressCountry": "IL"
            },
            "openingHours": "Su-Th 09:00-18:00",
            "image": ["https://onlybest.co.il/media/og-cover.webp"]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-800 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            דלתות איכות לבית ולעסק
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            בחירה מדויקת, התקנה מקצועית, שירות מהיר
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center space-x-2 space-x-reverse transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>דברו איתנו בוואטסאפ</span>
            </a>
            <Link
              to="/catalog"
              className="bg-white text-orange-800 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              לצפייה בקטלוג
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doors */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              הדלתות המובילות שלנו
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              מבחר מעולה של דלתות איכותיות לכל צורך - מדלתות פנימיות ועד דלתות ביטחון
            </p>
          </div>
          
          {doorsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">טוען דלתות...</p>
            </div>
          ) : (
            <DoorCarousel doors={featuredDoors} />
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="bg-orange-800 hover:bg-orange-900 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block transition-colors duration-200"
            >
              לכל הקטלוג
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              למה Only Best?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              אנחנו מתמחים במתן פתרונות דלתות מקיפים עם דגש על איכות ושירות
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">איכות חומרים גבוהה</h3>
              <p className="text-gray-600">
                אנחנו עובדים עם יצרנים מובילים ומשתמשים רק בחומרים איכותיים
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">התקנה אחראית</h3>
              <p className="text-gray-600">
                צוות מקצועי ומנוסה מבצע התקנה מדויקת ומקפיד על פרטים הקטנים
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">אחריות ושירות</h3>
              <p className="text-gray-600">
                אחריות מלאה על כל המוצרים ושירות לאחר המכירה מהמובילים בתחום
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-orange-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">מחירים הוגנים</h3>
              <p className="text-gray-600">
                יחס איכות מחיר מעולה עם שקיפות מלאה בתמחור ובלי עלויות נסתרות
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              מה הלקוחות אומרים
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              הביקורות האמיתיות של הלקוחות שלנו מספרות הכל
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/reviews"
              className="bg-orange-800 hover:bg-orange-900 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block transition-colors duration-200"
            >
              לעוד ביקורות
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-orange-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            צרו קשר עכשיו לקבלת ייעוץ מקצועי והצעת מחיר חינם
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center space-x-2 space-x-reverse transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>וואטסאפ</span>
            </a>
            <a
              href={`tel:${currentBusinessInfo.phone}`}
              className="bg-white text-orange-800 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              התקשרו עכשיו
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-800 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              טופס יצירת קשר
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;