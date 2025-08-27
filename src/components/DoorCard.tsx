import React, { useState } from 'react';
import { Door } from '../types';
import { MessageCircle, Eye } from 'lucide-react';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';
import { useFirestore } from '../hooks/useFirestore';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import ImageModal from './ImageModal';

interface DoorCardProps {
  door: Door;
  showFullDetails?: boolean;
}

const DoorCard: React.FC<DoorCardProps> = ({ door, showFullDetails = false }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const { data: businessData } = useFirestore('business');
  const business = businessData || defaultBusinessInfo;

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage(door.name);
    const whatsappUrl = createWhatsAppUrl(business.whatsapp, message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="card-elevated overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="relative">
          <img
            src={door.images[0]?.url || '/placeholder-door.jpg'}
            alt={door.images[0]?.alt || door.name}
            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          
          <button
            onClick={() => setShowImageModal(true)}
            className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            title="צפה בתמונה מלאה"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="heading-sm mb-3 text-gray-900">{door.name}</h3>
          <p className="text-body-sm mb-4 line-clamp-2">{door.short_description}</p>
          
          {showFullDetails && (
            <div className="mb-4">
              <p className="text-gray-700 mb-3">{door.description}</p>
              
              {door.materials.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">חומרים: </span>
                  <span className="text-gray-600">{door.materials.join(', ')}</span>
                </div>
              )}
              
              {door.colors.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">צבעים זמינים: </span>
                  <span className="text-gray-600">{door.colors.join(', ')}</span>
                </div>
              )}
              
              {door.sizes.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">מידות: </span>
                  <span className="text-gray-600">{door.sizes.join(', ')}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {door.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">{door.price_range}</span>
            <button
              onClick={handleWhatsAppClick}
              className="btn-primary text-sm px-6 py-2"
            >
              <Eye className="w-4 h-4 ml-2" />
              <span>פנייה</span>
            </button>
          </div>
        </div>
      </div>

      {showImageModal && (
        <ImageModal
          images={door.images}
          currentIndex={0}
          onClose={() => setShowImageModal(false)}
          title={door.name}
        />
      )}
    </>
  );
};

export default DoorCard;