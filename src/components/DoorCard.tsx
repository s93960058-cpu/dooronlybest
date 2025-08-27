import React, { useState } from 'react';
import { Door } from '../types';
import { MessageCircle, Eye } from 'lucide-react';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import ImageModal from './ImageModal';

interface DoorCardProps {
  door: Door;
  showFullDetails?: boolean;
}

const DoorCard: React.FC<DoorCardProps> = ({ door, showFullDetails = false }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  const handleWhatsAppClick = () => {
    const message = `שלום, אני מעוניין/ת לקבל מידע נוסף על ${door.name}`;
    sendWhatsAppMessage(message);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={door.images[0]?.url || '/placeholder-door.jpg'}
            alt={door.images[0]?.alt || door.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={() => setShowImageModal(true)}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            title="צפה בתמונה מלאה"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">{door.name}</h3>
          <p className="text-gray-600 mb-4">{door.short_description}</p>
          
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
                className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-orange-600">{door.price_range}</span>
            <button
              onClick={handleWhatsAppClick}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
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