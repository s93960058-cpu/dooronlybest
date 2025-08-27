import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Mail, Zap, Shield, Palette, Ruler } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';
import   DoorCard  from '../components/DoorCard';
import { useFirestore } from '../hooks/useFirestore';
import { Door, BusinessInfo } from '../types';
import { doorsData as defaultDoorsData } from '../data/doors';

const DoorDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showQuickContact, setShowQuickContact] = useState(false);
  
  const { data: firebaseDoors, loading } = useFirestore<Door>('doors');
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  
  // Use Firebase data if available, otherwise fallback to default data
  const doorsData = firebaseDoors.length > 0 ? firebaseDoors : defaultDoorsData;
  const businessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  const door = doorsData.find(d => d.slug === slug);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!door) {
    return <Navigate to="/404" replace />;
  }

  const whatsappUrl = createWhatsAppUrl(
    businessInfo.whatsapp,
    getWhatsAppMessage('catalog', door.name)
  );

  const relatedDoors = doorsData
    .filter(d => d.id !== door.id && d.category === door.category && d.is_active)
    .slice(0, 3);

  const handleQuickContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const contactData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      message: `מתעניין בדלת: ${door.name}`,
      door_name: door.name,
      door_id: door.id,
      inquiry_type: 'door_specific'
    };
    
    try {
      // Save to Firebase
      await addDoc(collection(db, 'contacts'), {
        ...contactData,
        created_at: Timestamp.now(),
        status: 'new'
      });
      
      alert('תודה על פנייתכם! נחזור אליכם בהקדם האפשרי');
      setShowQuickContact(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('שגיאה בשליחת הטופס. אנא נסו שוב.');
    }
  };

  return (
    <>
      <Helmet>
        <title>{door.name} - Only Best | {door.short_description}</title>
        <meta name="keywords" content={`${door.name}, ${door.tags.join(', ')}, ${door.category}, דלתות`} />
        <meta property="og:title" content={`${door.name} - Only Best`} />
        <meta property="og:description" content={door.description} />
        <meta property="og:image" content={door.images[0]?.url || "/image.png"} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": door.name,
            "description": door.description,
            "image": door.images.map(img => img.url),
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock"
            },
            "brand": {
              "@type": "Brand",
              "name": "Only Best"
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse mb-8 text-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-800">בית</Link>
          <span className="text-gray-400">/</span>
          <Link to="/catalog" className="text-blue-600 hover:text-blue-800">קטלוג</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{door.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-[4/5] mb-4 overflow-hidden rounded-lg">
              <img
                src={door.images[selectedImageIndex]?.url}
                alt={door.images[selectedImageIndex]?.alt || door.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {door.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {door.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded border-2 ${
                      selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {door.name}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {door.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {door.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Price */}
            {/* Price removed from public display */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg text-center font-semibold flex items-center justify-center space-x-2 space-x-reverse transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span>ברר על הדגם בוואטסאפ</span>
              </a>
              
              <button
                onClick={() => setShowQuickContact(true)}
                className="flex-1 bg-orange-800 hover:bg-orange-900 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 space-x-reverse transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
                <span>השאירו פרטים</span>
              </button>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Materials */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Shield className="w-5 h-5 text-orange-600 ml-2" />
                  <h3 className="font-semibold text-gray-900">חומרים</h3>
                </div>
                <ul className="text-gray-600 space-y-1">
                  {door.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>

              {/* Colors */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Palette className="w-5 h-5 text-orange-600 ml-2" />
                  <h3 className="font-semibold text-gray-900">צבעים זמינים</h3>
                </div>
                <ul className="text-gray-600 space-y-1">
                  {door.colors.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul>
              </div>

              {/* Sizes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Ruler className="w-5 h-5 text-orange-600 ml-2" />
                  <h3 className="font-semibold text-gray-900">מידות</h3>
                </div>
                <ul className="text-gray-600 space-y-1">
                  {door.sizes.map((size, index) => (
                    <li key={index}>{size} ס"מ</li>
                  ))}
                </ul>
              </div>

              {/* Add-ons */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Zap className="w-5 h-5 text-orange-600 ml-2" />
                  <h3 className="font-semibold text-gray-900">תוספות</h3>
                </div>
                <ul className="text-gray-600 space-y-1">
                  {door.addons.map((addon, index) => (
                    <li key={index}>{addon}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Doors */}
        {relatedDoors.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              דלתות דומות
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedDoors.map((relatedDoor) => (
                <DoorCard key={relatedDoor.id} door={relatedDoor} />
              ))}
            </div>
          </section>
        )}

        {/* Quick Contact Modal */}
        {showQuickContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">השאירו פרטים - {door.name}</h3>
              <form onSubmit={handleQuickContact}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-800 text-white py-2 px-4 rounded-lg hover:bg-orange-900 transition-colors duration-200"
                  >
                    שלח
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickContact(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoorDetail;
