import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye } from 'lucide-react';
import { Door } from '../types';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import { useFirestore } from '../hooks/useFirestore';
import { BusinessInfo } from '../types';

interface DoorCardProps {
  door: Door;
}

export const DoorCard: React.FC<DoorCardProps> = ({ door }) => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const businessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  const whatsappUrl = createWhatsAppUrl(
    businessInfo.whatsapp,
    getWhatsAppMessage('catalog', door.name)
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={door.images[0]?.url}
          alt={door.images[0]?.alt || door.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{door.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{door.short_description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {door.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        {/* Price removed from public display */}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/catalog/${door.slug}`}
            className="flex-1 bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg text-center flex items-center justify-center space-x-2 space-x-reverse transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>פרטים</span>
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
            title="פנה בוואטסאפ"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};