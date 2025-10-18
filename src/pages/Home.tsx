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
              "streetAddress": "התעשייה 6",
              "addressLocality": "ערד",
              "addressCountry": "IL"
            },
            "openingHours": "Su-Th 09:00-18:00 , fri 09:00-13:00",
            "image": ["https://onlybest.co.il/image.png"]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden min-h-screen flex items-center">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-40 h-40 bg-orange-400/15 rounded-full animate-float blur-xl"></div>
          <div className="absolute top-40 right-32 w-32 h-32 bg-amber-400/10 rounded-full animate-float-delayed blur-xl"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-orange-300/20 rounded-full animate-float blur-2xl" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-amber-300/12 rounded-full animate-float-delayed blur-xl" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-1/4 right-1/3 w-36 h-36 bg-orange-500/18 rounded-full animate-float blur-2xl" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative container-professional text-center section-padding">
          <div className="inline-block mb-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/30 shadow-2xl">
            <span className="text-lg font-semibold text-white drop-shadow-lg">המומחים בדלתות איכותיות</span>
          </div>
          <h1 className="heading-xl mb-8 text-white drop-shadow-2xl leading-tight">
            <span className="block mb-4">Only Best</span>
            <span className="block text-5xl lg:text-6xl text-orange-200 font-light">הכי טוב לבית שלך</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-16 max-w-4xl mx-auto text-white/95 leading-relaxed font-light drop-shadow-lg">
            בחירה מדויקת • התקנה מקצועית • שירות מהיר
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-3xl mx-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-success text-xl flex items-center justify-center gap-4 animate-pulse-glow px-12 py-5 font-bold"
            >
              <MessageCircle className="w-6 h-6" />
              <span>דברו איתנו בוואטסאפ</span>
            </a>
            <Link
              to="/catalog"
              className="bg-white/98 backdrop-blur-sm text-gray-900 hover:bg-white px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-500 shadow-2xl hover:shadow-white/30 transform hover:scale-110 hover:-translate-y-1 active:scale-95 border-2 border-white/50"
            >
              לצפייה בקטלוג המלא
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doors */}
      <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container-professional">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-orange-100 rounded-full border border-orange-200">
              <span className="text-sm font-bold text-orange-800 tracking-wide">הקולקציה המיוחדת שלנו</span>
            </div>
            <h2 className="heading-lg mb-8 bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 bg-clip-text text-transparent">
              הדלתות המובילות שלנו
            </h2>
            <p className="text-body max-w-3xl mx-auto text-gray-700">
              מבחר מעולה של דלתות איכותיות לכל צורך ולכל סגנון
            </p>
          </div>
          
          {doorsLoading ? (
            <div className="text-center py-8">
              <p className="text-body">טוען דלתות...</p>
            </div>
          ) : (
            <DoorCarousel doors={featuredDoors} title="הדלתות המובילות שלנו" />
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
      <section className="section-padding bg-gradient-to-b from-white via-orange-50/30 to-white">
        <div className="container-professional">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-orange-100 rounded-full border border-orange-200">
              <span className="text-sm font-bold text-orange-800 tracking-wide">היתרונות שלנו</span>
            </div>
            <h2 className="heading-lg mb-8 bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 bg-clip-text text-transparent">
              למה Only Best?
            </h2>
            <p className="text-body max-w-3xl mx-auto text-gray-700 font-medium">
              אנחנו מתמחים במתן פתרונות דלתות מקיפים עם דגש על איכות ושירות
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-100 via-orange-200 to-amber-200 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:rotate-6 border-2 border-orange-300/50">
                <Award className="w-12 h-12 text-orange-700 transition-transform duration-500 group-hover:scale-125" />
              </div>
              <h3 className="heading-sm mb-4 font-bold">איכות חומרים גבוהה</h3>
              <p className="text-body-sm">
                אנחנו עובדים עם יצרנים מובילים ומשתמשים רק בחומרים איכותיים
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:rotate-6 border-2 border-blue-300/50">
                <Users className="w-12 h-12 text-blue-700 transition-transform duration-500 group-hover:scale-125" />
              </div>
              <h3 className="heading-sm mb-4 font-bold">התקנה אחראית</h3>
              <p className="text-body-sm">
                צוות מקצועי ומנוסה מבצע התקנה מדויקת ומקפיד על פרטים הקטנים
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-emerald-100 via-emerald-200 to-teal-200 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:rotate-6 border-2 border-emerald-300/50">
                <Shield className="w-12 h-12 text-emerald-700 transition-transform duration-500 group-hover:scale-125" />
              </div>
              <h3 className="heading-sm mb-4 font-bold">אחריות ושירות</h3>
              <p className="text-body-sm">
                אחריות מלאה על כל המוצרים ושירות לאחר המכירה מהמובילים בתחום
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-200 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:rotate-6 border-2 border-amber-300/50">
                <Phone className="w-12 h-12 text-amber-700 transition-transform duration-500 group-hover:scale-125" />
              </div>
              <h3 className="heading-sm mb-4 font-bold">מחירים הוגנים</h3>
              <p className="text-body-sm">
                יחס איכות מחיר מעולה עם שקיפות מלאה בתמחור ובלי עלויות נסתרות
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
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
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative container-professional text-center">
          <h2 className="heading-lg mb-6 text-white">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto text-white/90 leading-relaxed font-medium">
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
              className="bg-white/95 backdrop-blur-sm text-orange-900 hover:bg-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              התקשרו עכשיו
            </a>
            <Link
              to="/contact"
              className="border-2 border-white/80 text-white hover:bg-white hover:text-orange-900 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 backdrop-blur-sm"
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