import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Award, Users, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import   DoorCard from '../components/DoorCard';
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
            "logo": "https://onlybest.co.il/image.png",
            "telephone": currentBusinessInfo.phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "יהודה 6",
              "addressLocality": "ערד",
              "addressCountry": "IL"
            },
            "openingHours": "Su-Th 09:00-18:00",
            "image": ["https://onlybest.co.il/image.png"]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative container-professional text-center section-padding">
          <h1 className="heading-xl mb-8 text-white">
            Only Best - הכי טוב לבית שלך
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
            בחירה מדויקת, התקנה מקצועית, שירות מהיר
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-success text-lg flex items-center justify-center gap-3 animate-pulse-glow"
            >
              <MessageCircle className="w-5 h-5" />
              <span>דברו איתנו בוואטסאפ</span>
            </a>
            <Link
              to="/catalog"
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              לצפייה בקטלוג
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doors */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-professional">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-6">
              הדלתות המובילות שלנו
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              מבחר מעולה של דלתות איכותיות לכל צורך - מדלתות פנימיות ועד דלתות ביטחון
            </p>
          </div>
          
          {doorsLoading ? (
            <div className="text-center py-8">
              <p className="text-body">טוען דלתות...</p>
            </div>
          ) : (
            <DoorCarousel doors={featuredDoors} />
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="btn-primary inline-block"
            >
              לכל הקטלוג
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-professional">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-6">
              למה Only Best?
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              אנחנו מתמחים במתן פתרונות דלתות מקיפים עם דגש על איכות ושירות
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="heading-sm mb-4">איכות חומרים גבוהה</h3>
              <p className="text-body-sm">
                אנחנו עובדים עם יצרנים מובילים ומשתמשים רק בחומרים איכותיים
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="heading-sm mb-4">התקנה אחראית</h3>
              <p className="text-body-sm">
                צוות מקצועי ומנוסה מבצע התקנה מדויקת ומקפיד על פרטים הקטנים
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <Shield className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="heading-sm mb-4">אחריות ושירות</h3>
              <p className="text-body-sm">
                אחריות מלאה על כל המוצרים ושירות לאחר המכירה מהמובילים בתחום
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <Phone className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="heading-sm mb-4">מחירים הוגנים</h3>
              <p className="text-body-sm">
                יחס איכות מחיר מעולה עם שקיפות מלאה בתמחור ובלי עלויות נסתרות
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-professional">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-6">
              מה הלקוחות אומרים
            </h2>
            <p className="text-body max-w-3xl mx-auto">
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
              className="btn-primary inline-block"
            >
              לעוד ביקורות
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="relative section-padding hero-gradient text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        
        <div className="relative container-professional text-center">
          <h2 className="heading-lg mb-6 text-white">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto text-blue-100 leading-relaxed">
            צרו קשר עכשיו לקבלת ייעוץ מקצועי והצעת מחיר חינם
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-3xl mx-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-success text-lg flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              <span>וואטסאפ</span>
            </a>
            <a
              href={`tel:${currentBusinessInfo.phone}`}
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              התקשרו עכשיו
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
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