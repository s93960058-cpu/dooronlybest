import React from 'react';
import { MessageCircle } from 'lucide-react';
import { businessInfo as defaultBusinessInfo } from '../data/business';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';
import { useFirestore } from '../hooks/useFirestore';
import { BusinessInfo } from '../types';

interface WhatsAppButtonProps {
  context?: string;
  doorName?: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  context = 'site', 
  doorName, 
  className = '' 
}) => {
  const { data: businessData } = useFirestore<BusinessInfo>('business');
  const businessInfo = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  const message = getWhatsAppMessage(context, doorName);
  const url = createWhatsAppUrl(businessInfo.whatsapp, message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 left-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40 ${className}`}
      aria-label="פנייה בוואטסאפ"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;