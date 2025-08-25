export const createWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const getWhatsAppMessage = (context: string = 'site', doorName?: string): string => {
  let message = 'היי, הגעתי מאתר Only Best';
  
  if (context === 'catalog' && doorName) {
    message += ` ואני מתעניין בדלת: ${doorName}`;
  } else if (context === 'catalog') {
    message += ' ואני מתעניין בקטלוג הדלתות';
  } else if (context === 'contact') {
    message += ' ואני רוצה לקבל פרטים נוספים';
  }
  
  message += '. אשמח להתייעץ לגבי רכישת דלת';
  
  return message;
};