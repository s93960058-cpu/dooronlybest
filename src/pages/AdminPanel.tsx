import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFirebaseSetup } from '../hooks/useFirebaseSetup';
import { 
  Package, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Save,
  X,
  MessageCircle,
  Star,
  Palette,
  Type,
  Globe,
  Image,
  FileText,
  Users,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminLogin from '../components/AdminLogin';
import { useFirestore } from '../hooks/useFirestore';
import { Door, ContactForm, BusinessInfo, Review } from '../types';
import { useImageUpload } from '../hooks/useImageUpload';

// Site Settings Interface
interface SiteSettings {
  id?: string;
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  logo_url?: string;
  favicon_url?: string;
  about_title: string;
  about_description: string;
  contact_title: string;
  contact_description: string;
  footer_text: string;
  meta_keywords: string;
  social_facebook?: string;
  social_instagram?: string;
  social_whatsapp?: string;
  created_at?: any;
  updated_at?: any;
}

const AdminPanel: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auto-setup Firebase collections
  useFirebaseSetup();
  
  const { data: doors, loading: doorsLoading, addItem: addDoor, updateItem: updateDoor, deleteItem: deleteDoor } = useFirestore<Door>('doors');
  const { data: contacts, loading: contactsLoading, updateItem: updateContact, deleteItem: deleteContact } = useFirestore<ContactForm>('contacts');
  const { data: reviews, loading: reviewsLoading, updateItem: updateReview, deleteItem: deleteReview } = useFirestore<Review>('reviews');
  const { data: businessSettings, loading: businessLoading, updateItem: updateBusiness } = useFirestore<BusinessInfo>('business');
  const { data: siteSettings, loading: siteLoading, addItem: addSiteSettings, updateItem: updateSiteSettings } = useFirestore<SiteSettings>('site_settings');

  // If not admin, show login screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <AdminLogin 
            isOpen={true} 
            onClose={() => {}} 
            onLoginSuccess={() => {}}
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'לוח בקרה', icon: BarChart3 },
    { id: 'catalog', name: 'ניהול קטלוג', icon: Package },
    { id: 'contacts', name: 'פניות לקוחות', icon: MessageSquare },
    { id: 'reviews', name: 'ניהול ביקורות', icon: Star },
    { id: 'business', name: 'הגדרות עסק', icon: Settings },
    { id: 'site', name: 'עיצוב ותוכן', icon: Palette },
    { id: 'seo', name: 'SEO ושיווק', icon: Globe }
  ];

  // Dashboard Statistics
  const stats = {
    totalDoors: doors.length,
    activeDoors: doors.filter(d => d.is_active).length,
    totalContacts: contacts.length,
    newContacts: contacts.filter(c => c.status === 'new').length,
    totalReviews: reviews.length,
    approvedReviews: reviews.filter(r => r.approved === true).length,
    averageRating: reviews.filter(r => r.approved === true).length > 0 
      ? (reviews.filter(r => r.approved === true).reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.approved === true).length).toFixed(1)
      : '0'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  פאנל ניהול Only Best
                </h1>
                <p className="text-gray-600">ניהול מלא של האתר והעסק</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              <span>יציאה</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeTab === 'dashboard' && <DashboardView stats={stats} />}
            {activeTab === 'catalog' && (
              <CatalogManager 
                doors={doors} 
                loading={doorsLoading}
                onAdd={addDoor} 
                onUpdate={updateDoor} 
                onDelete={deleteDoor} 
              />
            )}
            {activeTab === 'contacts' && (
              <ContactsManager 
                contacts={contacts} 
                loading={contactsLoading}
                onUpdate={updateContact}
                onDelete={deleteContact}
              />
            )}
            {activeTab === 'reviews' && (
              <ReviewsManager 
                reviews={reviews} 
                loading={reviewsLoading}
                onUpdate={updateReview}
                onDelete={deleteReview}
              />
            )}
            {activeTab === 'business' && (
              <BusinessSettings 
                settings={businessSettings[0]} 
                loading={businessLoading}
                onUpdate={updateBusiness} 
              />
            )}
            {activeTab === 'site' && (
              <SiteDesignSettings 
                settings={siteSettings[0]} 
                loading={siteLoading}
                onAdd={addSiteSettings}
                onUpdate={updateSiteSettings} 
              />
            )}
            {activeTab === 'seo' && (
              <SEOSettings 
                settings={siteSettings[0]} 
                loading={siteLoading}
                onAdd={addSiteSettings}
                onUpdate={updateSiteSettings} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard View Component
const DashboardView: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">סקירה כללית</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">סה"כ דלתות</p>
                <p className="text-3xl font-bold">{stats.totalDoors}</p>
              </div>
              <Package className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">דלתות פעילות</p>
                <p className="text-3xl font-bold">{stats.activeDoors}</p>
              </div>
              <Eye className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">פניות חדשות</p>
                <p className="text-3xl font-bold">{stats.newContacts}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100">דירוג ממוצע</p>
                <p className="text-3xl font-bold">{stats.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-amber-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold mb-4 text-gray-900">פעילות אחרונה</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">עודכן קטלוג הדלתות</p>
              <p className="text-sm text-gray-600">לפני 2 שעות</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
            <div className="bg-green-600 p-2 rounded-lg">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">התקבלה פנייה חדשה</p>
              <p className="text-sm text-gray-600">לפני 4 שעות</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Site Design Settings Component
const SiteDesignSettings: React.FC<{
  settings?: SiteSettings;
  loading: boolean;
  onAdd: (settings: Omit<SiteSettings, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<SiteSettings>) => void;
}> = ({ settings, loading, onAdd, onUpdate }) => {
  const [formData, setFormData] = useState({
    site_title: settings?.site_title || 'Only Best - הכי טוב לבית שלך',
    site_description: settings?.site_description || 'מתמחים בדלתות איכות עם התקנה מקצועית ושירות מהיר',
    hero_title: settings?.hero_title || 'Only Best - הכי טוב לבית שלך',
    hero_subtitle: settings?.hero_subtitle || 'בחירה מדויקת, התקנה מקצועית, שירות מהיר',
    primary_color: settings?.primary_color || '#1e40af',
    secondary_color: settings?.secondary_color || '#64748b',
    accent_color: settings?.accent_color || '#f59e0b',
    font_family: settings?.font_family || 'Inter',
    about_title: settings?.about_title || 'אודות Only Best',
    about_description: settings?.about_description || 'חברה מובילה בתחום הדלתות מאז 2010',
    contact_title: settings?.contact_title || 'צרו קשר',
    contact_description: settings?.contact_description || 'נשמח לעזור לכם למצוא את הדלת המושלמת',
    footer_text: settings?.footer_text || '© 2025 Only Best. כל הזכויות שמורות.',
    meta_keywords: settings?.meta_keywords || 'דלתות, דלת פלדה, דלת עץ, דלת ביטחון, התקנת דלתות'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (settings?.id) {
        await onUpdate(settings.id, formData);
      } else {
        await onAdd(formData);
      }
      alert('ההגדרות נשמרו בהצלחה!');
    } catch (error) {
      alert('שגיאה בשמירת ההגדרות');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">טוען הגדרות...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
        <Palette className="w-6 h-6 text-blue-600" />
        עיצוב ותוכן האתר
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline ml-1" />
              כותרת האתר
            </label>
            <input
              type="text"
              value={formData.site_title}
              onChange={(e) => setFormData(prev => ({ ...prev, site_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline ml-1" />
              תיאור האתר
            </label>
            <input
              type="text"
              value={formData.site_description}
              onChange={(e) => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">חלק עליון (Hero)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת ראשית</label>
              <input
                type="text"
                value={formData.hero_title}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת משנה</label>
              <input
                type="text"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">צבעי האתר</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">צבע ראשי</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">צבע משני</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">צבע הדגשה</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accent_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">טיפוגרפיה</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 inline ml-1" />
              גופן
            </label>
            <select
              value={formData.font_family}
              onChange={(e) => setFormData(prev => ({ ...prev, font_family: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Heebo">Heebo</option>
              <option value="Assistant">Assistant</option>
            </select>
          </div>
        </div>

        {/* Page Content */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">תוכן דפים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת דף אודות</label>
              <input
                type="text"
                value={formData.about_title}
                onChange={(e) => setFormData(prev => ({ ...prev, about_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תיאור דף אודות</label>
              <input
                type="text"
                value={formData.about_description}
                onChange={(e) => setFormData(prev => ({ ...prev, about_description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת דף צור קשר</label>
              <input
                type="text"
                value={formData.contact_title}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תיאור דף צור קשר</label>
              <input
                type="text"
                value={formData.contact_description}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">כותרת תחתונה</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טקסט כותרת תחתונה</label>
            <input
              type="text"
              value={formData.footer_text}
              onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-800 text-white px-8 py-3 rounded-lg hover:bg-orange-900 flex items-center gap-2 text-lg"
        >
          <Save className="w-5 h-5" />
          <span>שמור שינויים</span>
        </button>
      </form>
    </div>
  );
};

// SEO Settings Component
const SEOSettings: React.FC<{
  settings?: SiteSettings;
  loading: boolean;
  onAdd: (settings: Omit<SiteSettings, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<SiteSettings>) => void;
}> = ({ settings, loading, onAdd, onUpdate }) => {
  const [formData, setFormData] = useState({
    meta_keywords: settings?.meta_keywords || 'דלתות, דלת פלדה, דלת עץ, דלת ביטחון, התקנת דלתות',
    social_facebook: settings?.social_facebook || '',
    social_instagram: settings?.social_instagram || '',
    social_whatsapp: settings?.social_whatsapp || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (settings?.id) {
        await onUpdate(settings.id, formData);
      } else {
        await onAdd(formData);
      }
      alert('הגדרות SEO נשמרו בהצלחה!');
    } catch (error) {
      alert('שגיאה בשמירת הגדרות SEO');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">טוען הגדרות SEO...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
        <Globe className="w-6 h-6 text-blue-600" />
        הגדרות SEO ושיווק
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מילות מפתח (מופרדות בפסיק)
          </label>
          <textarea
            value={formData.meta_keywords}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="דלתות, דלת פלדה, דלת עץ, דלת ביטחון"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">רשתות חברתיות</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                value={formData.social_facebook}
                onChange={(e) => setFormData(prev => ({ ...prev, social_facebook: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://facebook.com/onlybest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                value={formData.social_instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://instagram.com/onlybest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input
                type="text"
                value={formData.social_whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, social_whatsapp: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="+972583522191"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-800 text-white px-8 py-3 rounded-lg hover:bg-orange-900 flex items-center gap-2 text-lg"
        >
          <Save className="w-5 h-5" />
          <span>שמור הגדרות SEO</span>
        </button>
      </form>
    </div>
  );
};

// Catalog Manager Component
const CatalogManager: React.FC<{
  doors: Door[];
  loading: boolean;
  onAdd: (door: Omit<Door, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Door>) => void;
  onDelete: (id: string) => void;
}> = ({ doors, loading, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoor, setEditingDoor] = useState<Door | null>(null);

  const handleDelete = async (doorId: string, doorName: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את "${doorName}"?`)) {
      try {
        await onDelete(doorId);
        alert('הדלת נמחקה בהצלחה!');
      } catch (error) {
        alert('שגיאה במחיקת הדלת');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">טוען...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">ניהול קטלוג דלתות ({doors.length} פריטים)</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse hover:bg-orange-900"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף דלת</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doors.map((door) => (
          <div key={door.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{door.name}</h3>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => setEditingDoor(door)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(door.id, door.name)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">{door.short_description}</p>
            <div className="text-xs text-gray-500 mb-2">קטגוריה: {door.category}</div>
            <div className="flex flex-wrap gap-1">
              {door.tags.map((tag, index) => (
                <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Door Modal */}
      {showAddForm && (
        <DoorFormModal
          door={null}
          onSave={onAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Door Modal */}
      {editingDoor && (
        <DoorFormModal
          door={editingDoor}
          onSave={(doorData) => onUpdate(editingDoor.id, doorData)}
          onClose={() => setEditingDoor(null)}
        />
      )}
    </div>
  );
};

// Door Form Modal Component
const DoorFormModal: React.FC<{
  door: Door | null;
  onSave: (door: any) => void;
  onClose: () => void;
}> = ({ door, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: door?.name || '',
    short_description: door?.short_description || '',
    description: door?.description || '',
    category: door?.category || 'פנים',
    style: door?.style || ['מודרני'],
    tags: door?.tags?.join(', ') || '',
    materials: door?.materials?.join(', ') || '',
    finishes: door?.finishes?.join(', ') || '',
    colors: door?.colors?.join(', ') || '',
    sizes: door?.sizes?.join(', ') || '',
    addons: door?.addons?.join(', ') || '',
    price_range: door?.price_range || '₪₪ - בינוני',
    images: door?.images?.[0]?.url || '',
    display_priority: door?.display_priority || 5,
    is_active: door?.is_active ?? true
  });
  
  const { uploadImage, uploading } = useImageUpload();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, images: imageUrl }));
    } catch (error) {
      alert('שגיאה בהעלאת התמונה');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const doorData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
        style: formData.style,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        materials: formData.materials.split(',').map(material => material.trim()).filter(material => material),
        finishes: formData.finishes.split(',').map(finish => finish.trim()).filter(finish => finish),
        colors: formData.colors.split(',').map(color => color.trim()).filter(color => color),
        sizes: formData.sizes.split(',').map(size => size.trim()).filter(size => size),
        addons: formData.addons.split(',').map(addon => addon.trim()).filter(addon => addon),
        images: formData.images ? [{ url: formData.images, alt: formData.name }] : [],
        price: null,
      };

      await onSave(doorData);
      alert(door ? 'הדלת עודכנה בהצלחה!' : 'הדלת נוספה בהצלחה!');
      onClose();
    } catch (error) {
      console.error('Error saving door:', error);
      alert('שגיאה בשמירת הדלת');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {door ? 'עריכת דלת' : 'הוספת דלת חדשה'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם הדלת *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                קטגוריה *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="פנים">פנים</option>
                <option value="חוץ">חוץ</option>
                <option value="ביטחון">ביטחון</option>
                <option value="ממ״ד">ממ״ד</option>
                <option value="זכוכית">זכוכית</option>
                <option value="פרימיום">פרימיום</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תיאור קצר *
            </label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תיאור מפורט *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תמונה *
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              {uploading && (
                <p className="text-sm text-blue-600">מעלה תמונה...</p>
              )}
              {formData.images && (
                <div className="mt-2">
                  <img 
                    src={formData.images} 
                    alt="תצוגה מקדימה" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תגיות (מופרדות בפסיק)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="בידוד גבוה, עמיד מזג אוויר"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                חומרים (מופרדים בפסיק)
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                placeholder="פלדה, בידוד פוליאוריתן"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                צבעים (מופרדים בפסיק)
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value }))}
                placeholder="שחור, חום, לבן"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מידות (מופרדות בפסיק)
              </label>
              <input
                type="text"
                value={formData.sizes}
                onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                placeholder="80x200, 90x210"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תוספות (מופרדות בפסיק)
            </label>
            <input
              type="text"
              value={formData.addons}
              onChange={(e) => setFormData(prev => ({ ...prev, addons: e.target.value }))}
              placeholder="ידית מעוצבת, מנעול רב בריח"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                טווח מחירים
              </label>
              <select
                value={formData.price_range}
                onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="₪ - נמוך">₪ - נמוך</option>
                <option value="₪₪ - בינוני">₪₪ - בינוני</option>
                <option value="₪₪₪ - גבוה">₪₪₪ - גבוה</option>
                <option value="₪₪₪₪ - פרימיום">₪₪₪₪ - פרימיום</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                עדיפות תצוגה (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.display_priority}
                onChange={(e) => setFormData(prev => ({ ...prev, display_priority: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded ml-2"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              פעיל באתר
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-800 text-white py-2 px-4 rounded-lg hover:bg-orange-900 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Save className="w-4 h-4" />
              <span>{door ? 'עדכן' : 'הוסף'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Contacts Manager Component
const ContactsManager: React.FC<{ 
  contacts: ContactForm[];
  loading: boolean;
  onUpdate: (id: string, updates: Partial<ContactForm>) => void;
  onDelete: (id: string) => void;
}> = ({ contacts, loading, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState<'all' | 'door_specific' | 'general'>('all');
  
  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    if (filter === 'door_specific') return contact.inquiry_type === 'door_specific';
    if (filter === 'general') return !contact.inquiry_type || contact.inquiry_type !== 'door_specific';
    return true;
  });

  const handleStatusUpdate = async (contactId: string, newStatus: 'new' | 'contacted' | 'closed') => {
    try {
      await onUpdate(contactId, { status: newStatus });
      alert('הסטטוס עודכן בהצלחה!');
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const handleDelete = async (contactId: string, contactName: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הפנייה של ${contactName}?`)) {
      try {
        await onDelete(contactId);
        alert('הפנייה נמחקה בהצלחה!');
      } catch (error) {
        alert('שגיאה במחיקת הפנייה');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">טוען פניות...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">פניות לקוחות ({filteredContacts.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            הכל ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('door_specific')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'door_specific' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            פניות לדלתות ({contacts.filter(c => c.inquiry_type === 'door_specific').length})
          </button>
          <button
            onClick={() => setFilter('general')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'general' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            פניות כלליות ({contacts.filter(c => !c.inquiry_type || c.inquiry_type !== 'door_specific').length})
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            אין פניות עדיין
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Header with status and type */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  {contact.inquiry_type === 'door_specific' && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      פנייה לדלת ספציפית
                    </span>
                  )}
                  <select
                    value={contact.status || 'new'}
                    onChange={(e) => handleStatusUpdate(contact.id!, e.target.value as 'new' | 'contacted' | 'closed')}
                    className={`text-xs px-2 py-1 rounded-full border-none ${
                      contact.status === 'new' ? 'bg-green-100 text-green-800' :
                      contact.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="new">חדש</option>
                    <option value="contacted">נוצר קשר</option>
                    <option value="closed">סגור</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {contact.created_at && new Date(contact.created_at.seconds * 1000).toLocaleDateString('he-IL')}
                </div>
              </div>

              {/* Door specific info */}
              {contact.door_name && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">דלת מבוקשת:</span>
                  </div>
                  <span className="text-blue-700">{contact.door_name}</span>
                </div>
              )}

              {/* Contact details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{contact.name}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                        {contact.phone}
                      </a>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                          {contact.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">נושא: </span>
                    <span className="text-gray-900">{contact.subject}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">הודעה:</span>
                    <p className="text-gray-600 mt-1 leading-relaxed">{contact.message}</p>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t flex-wrap">
                <a
                  href={`tel:${contact.phone}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  התקשר
                </a>
                <a
                  href={`https://wa.me/${contact.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`שלום ${contact.name}, קיבלנו את פנייתכם לגבי ${contact.door_name || 'הדלתות שלנו'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  וואטסאפ
                </a>
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent(`תגובה לפנייתכם - ${contact.subject}`)}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    אימייל
                  </a>
                )}
                <button
                  onClick={() => handleDelete(contact.id!, contact.name)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  מחק
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Reviews Manager Component
const ReviewsManager: React.FC<{
  reviews: Review[];
  loading: boolean;
  onUpdate: (id: string, updates: Partial<Review>) => void;
  onDelete: (id: string) => void;
}> = ({ reviews, loading, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'pending') return review.approved === undefined || review.approved === null;
    if (filter === 'approved') return review.approved === true;
    if (filter === 'rejected') return review.approved === false;
    return true;
  });

  const handleApprove = async (reviewId: string) => {
    try {
      await onUpdate(reviewId, { approved: true });
      alert('הביקורת אושרה בהצלחה!');
    } catch (error) {
      alert('שגיאה באישור הביקורת');
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await onUpdate(reviewId, { approved: false });
      alert('הביקורת נדחתה');
    } catch (error) {
      alert('שגיאה בדחיית הביקורת');
    }
  };

  const handleDelete = async (reviewId: string, reviewerName: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הביקורת של ${reviewerName}?`)) {
      try {
        await onDelete(reviewId);
        alert('הביקורת נמחקה בהצלחה!');
      } catch (error) {
        alert('שגיאה במחיקת הביקורת');
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">טוען ביקורות...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">ניהול ביקורות ({filteredReviews.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            הכל ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            ממתינות ({reviews.filter(r => r.approved === undefined || r.approved === null).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'approved' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            מאושרות ({reviews.filter(r => r.approved === true).length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'rejected' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            נדחו ({reviews.filter(r => r.approved === false).length})
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            אין ביקורות עדיין
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Header with status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    review.approved === true ? 'bg-green-100 text-green-800' :
                    review.approved === false ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.approved === true ? 'מאושר' : 
                     review.approved === false ? 'נדחה' : 'ממתין לאישור'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('he-IL')}
                </div>
              </div>

              {/* Review content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {review.approved !== true && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                  >
                    <Star className="w-4 h-4" />
                    אשר
                  </button>
                )}
                {review.approved !== false && (
                  <button
                    onClick={() => handleReject(review.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    דחה
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id, review.name)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  מחק
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Business Settings Component
const BusinessSettings: React.FC<{
  settings?: BusinessInfo;
  loading: boolean;
  onUpdate: (id: string, updates: Partial<BusinessInfo>) => void;
}> = ({ settings, loading, onUpdate }) => {
  const [formData, setFormData] = useState({
    hours: settings?.hours || 'ראשון-חמישי: 09:00-18:00',
    address: settings?.address || 'יהודה 6, ערד',
    phone: settings?.phone || '+972583522191',
    email: settings?.email || 'info@onlybest.co.il'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (settings?.id) {
        await onUpdate(settings.id, formData);
      }
      alert('ההגדרות נשמרו בהצלחה!');
    } catch (error) {
      alert('שגיאה בשמירת ההגדרות');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">טוען הגדרות...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">הגדרות עסק</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="w-4 h-4 inline ml-1" />
            שעות פעילות
          </label>
          <input
            type="text"
            value={formData.hours}
            onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline ml-1" />
            כתובת
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline ml-1" />
            טלפון
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline ml-1" />
            אימייל
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-800 text-white px-6 py-2 rounded-lg hover:bg-orange-900 flex items-center space-x-2 space-x-reverse"
        >
          <Save className="w-4 h-4" />
          <span>שמור שינויים</span>
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;