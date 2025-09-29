import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  MessageSquare, 
  Star, 
  Settings, 
  Palette, 
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Upload,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { useImageUpload } from '../hooks/useImageUpload';
import { Door, Review, ContactForm, BusinessInfo } from '../types';

const AdminPanel: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddDoor, setShowAddDoor] = useState(false);
  const [editingDoor, setEditingDoor] = useState<Door | null>(null);
  const [siteSettings, setSiteSettings] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    heroTitle: 'Only Best - הכי טוב לבית שלך',
    heroSubtitle: 'בחירה מדויקת, התקנה מקצועית, שירות מהיר',
    aboutTitle: 'אודות Only Best',
    aboutDescription: 'מאז 2025 אנחנו מספקים פתרונות דלתות מתקדמים ואיכותיים',
    metaKeywords: 'דלתות,  דלת עץ,  התקנת דלתות, ערד',
    socialFacebook: '',
    socialInstagram: '',
    socialWhatsapp: '+972583522191'
  });

  const { data: doors, loading: doorsLoading, addItem: addDoor, updateItem: updateDoor, deleteItem: deleteDoor } = useFirestore<Door>('doors');
  const { data: reviews, loading: reviewsLoading, updateItem: updateReview, deleteItem: deleteReview } = useFirestore<Review>('reviews');
  const { data: contacts, loading: contactsLoading, updateItem: updateContact, deleteItem: deleteContact } = useFirestore<ContactForm>('contacts');
  const { data: businessData, loading: businessLoading, updateItem: updateBusiness } = useFirestore<BusinessInfo>('business');
  const { uploadImage, uploading } = useImageUpload();

  const [newDoor, setNewDoor] = useState<Partial<Door>>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    category: 'פנים',
    style: [],
    tags: [],
    materials: [],
    finishes: [],
    colors: [],
    sizes: [],
    addons: [],
    price_range: ' ',
    price: null,
    images: [],
    display_priority: 5,
    is_active: true
  });

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'Only Best',
    address: 'יהודה 6, ערד',
    phone: '+972583522191',
    email: 'info@onlybest.co.il',
    hours: 'ראשון-חמישי: 09:00-18:00'
  });

  useEffect(() => {
    if (businessData.length > 0) {
      setBusinessInfo(businessData[0]);
    }
  }, [businessData]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file);
      return { url, alt: file.name };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleAddDoor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoor(newDoor as Omit<Door, 'id'>);
      setNewDoor({
        name: '',
        slug: '',
        short_description: '',
        description: '',
        category: 'פנים',
        style: [],
        tags: [],
        materials: [],
        finishes: [],
        colors: [],
        sizes: [],
        addons: [],
        price_range: '₪₪ - בינוני',
        price: null,
        images: [],
        display_priority: 5,
        is_active: true
      });
      setShowAddDoor(false);
      alert('דלת נוספה בהצלחה!');
    } catch (error) {
      console.error('Error adding door:', error);
      alert('שגיאה בהוספת הדלת');
    }
  };

  const handleUpdateDoor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoor) return;
    
    try {
      await updateDoor(editingDoor.id!, editingDoor);
      setEditingDoor(null);
      alert('דלת עודכנה בהצלחה!');
    } catch (error) {
      console.error('Error updating door:', error);
      alert('שגיאה בעדכון הדלת');
    }
  };

  const handleDeleteDoor = async (doorId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הדלת?')) {
      try {
        await deleteDoor(doorId);
        alert('דלת נמחקה בהצלחה!');
      } catch (error) {
        console.error('Error deleting door:', error);
        alert('שגיאה במחיקת הדלת');
      }
    }
  };

  const handleApproveReview = async (reviewId: string, approved: boolean) => {
    try {
      await updateReview(reviewId, { approved });
      alert(approved ? 'ביקורת אושרה!' : 'ביקורת נדחתה!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert('שגיאה בעדכון הביקורת');
    }
  };

  const handleUpdateContactStatus = async (contactId: string, status: string) => {
    try {
      await updateContact(contactId, { status });
      alert('סטטוס עודכן!');
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const handleUpdateBusinessInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (businessData.length > 0) {
        await updateBusiness(businessData[0].id!, businessInfo);
      }
      alert('פרטי העסק עודכנו בהצלחה!');
    } catch (error) {
      console.error('Error updating business info:', error);
      alert('שגיאה בעדכון פרטי העסק');
    }
  };

  const applySiteSettings = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', siteSettings.primaryColor);
    root.style.setProperty('--secondary-color', siteSettings.secondaryColor);
    root.style.setProperty('--accent-color', siteSettings.accentColor);
    document.body.style.fontFamily = siteSettings.fontFamily;
    
    // Save to localStorage
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    alert('הגדרות העיצוב הוחלו בהצלחה!');
  };

  const stats = {
    totalDoors: doors.length,
    activeDoors: doors.filter(d => d.is_active).length,
    totalReviews: reviews.length,
    approvedReviews: reviews.filter(r => r.approved).length,
    pendingReviews: reviews.filter(r => r.approved === null).length,
    totalContacts: contacts.length,
    newContacts: contacts.filter(c => c.status === 'new').length
  };

  const tabs = [
    { id: 'dashboard', name: 'לוח בקרה', icon: BarChart3 },
    { id: 'doors', name: 'ניהול קטלוג', icon: Package },
    { id: 'contacts', name: 'פניות לקוחות', icon: MessageSquare },
    { id: 'reviews', name: 'ניהול ביקורות', icon: Star },
    { id: 'business', name: 'הגדרות עסק', icon: Settings },
    { id: 'design', name: 'עיצוב ותוכן', icon: Palette },
    { id: 'seo', name: 'SEO ושיווק', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-professional">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">פנאל ניהול Only Best</h1>
            <button
              onClick={logout}
              className="admin-button-danger"
            >
              יציאה
            </button>
          </div>
        </div>
      </div>

      <div className="container-professional py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="admin-card p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-right rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
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
          <div className="lg:col-span-3">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="admin-card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6" />
                    לוח בקרה
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card-blue p-6 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-800 font-semibold">סה"כ דלתות</p>
                          <p className="text-3xl font-bold text-blue-900">{stats.totalDoors}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="card-emerald p-6 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-800 font-semibold">דלתות פעילות</p>
                          <p className="text-3xl font-bold text-emerald-900">{stats.activeDoors}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      </div>
                    </div>

                    <div className="card-gold p-6 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-800 font-semibold">ביקורות מאושרות</p>
                          <p className="text-3xl font-bold text-amber-900">{stats.approvedReviews}</p>
                        </div>
                        <Star className="w-8 h-8 text-amber-600" />
                      </div>
                    </div>

                    <div className="card-slate p-6 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-semibold">פניות חדשות</p>
                          <p className="text-3xl font-bold text-gray-900">{stats.newContacts}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="admin-card p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    פעילות אחרונה
                  </h3>
                  <div className="space-y-3">
                    {contacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.subject}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.status === 'new' ? 'bg-red-100 text-red-800' :
                          contact.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {contact.status === 'new' ? 'חדש' : 
                           contact.status === 'contacted' ? 'בטיפול' : 'סגור'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Doors Management */}
            {activeTab === 'doors' && (
              <div className="space-y-6">
                <div className="admin-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Package className="w-6 h-6" />
                      ניהול קטלוג דלתות
                    </h2>
                    <button
                      onClick={() => setShowAddDoor(true)}
                      className="admin-button flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      הוסף דלת חדשה
                    </button>
                  </div>

                  {doorsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">טוען דלתות...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">שם</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">קטגוריה</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">מחיר</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">סטטוס</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">פעולות</th>
                          </tr>
                        </thead>
                        <tbody>
                          {doors.map((door) => (
                            <tr key={door.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  {door.images[0] && (
                                    <img
                                      src={door.images[0].url}
                                      alt={door.name}
                                      className="w-12 h-12 object-cover rounded-lg"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">{door.name}</p>
                                    <p className="text-sm text-gray-600">{door.short_description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-700">{door.category}</td>
                              <td className="py-3 px-4 text-gray-700">{door.price_range}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  door.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {door.is_active ? 'פעיל' : 'לא פעיל'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingDoor(door)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="עריכה"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDoor(door.id!)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="מחיקה"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contacts Management */}
            {activeTab === 'contacts' && (
              <div className="admin-card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" />
                  פניות לקוחות
                </h2>

                {contactsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">טוען פניות...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{contact.name}</h3>
                            <p className="text-gray-600">{contact.phone}</p>
                            {contact.email && <p className="text-gray-600">{contact.email}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={contact.status || 'new'}
                              onChange={(e) => handleUpdateContactStatus(contact.id!, e.target.value)}
                              className="admin-input text-sm"
                            >
                              <option value="new">חדש</option>
                              <option value="contacted">בטיפול</option>
                              <option value="closed">סגור</option>
                            </select>
                            <button
                              onClick={() => deleteContact(contact.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="font-semibold text-gray-900 mb-1">נושא: {contact.subject}</p>
                          <p className="text-gray-700">{contact.message}</p>
                        </div>
                        {contact.door_name && (
                          <p className="text-sm text-blue-600">מתעניין בדלת: {contact.door_name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Management */}
            {activeTab === 'reviews' && (
              <div className="admin-card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6" />
                  ניהול ביקורות
                </h2>

                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">טוען ביקורות...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{review.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {review.approved === null && (
                              <>
                                <button
                                  onClick={() => handleApproveReview(review.id!, true)}
                                  className="admin-button-success text-sm"
                                >
                                  אשר
                                </button>
                                <button
                                  onClick={() => handleApproveReview(review.id!, false)}
                                  className="admin-button-danger text-sm"
                                >
                                  דחה
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteReview(review.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{review.date}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            review.approved === true ? 'bg-green-100 text-green-800' :
                            review.approved === false ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {review.approved === true ? 'מאושר' :
                             review.approved === false ? 'נדחה' : 'ממתין לאישור'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Business Settings */}
            {activeTab === 'business' && (
              <div className="admin-card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  הגדרות עסק
                </h2>

                <form onSubmit={handleUpdateBusinessInfo} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline ml-1" />
                        כתובת
                      </label>
                      <input
                        type="text"
                        value={businessInfo.address}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, address: e.target.value }))}
                        className="admin-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline ml-1" />
                        טלפון
                      </label>
                      <input
                        type="tel"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="admin-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline ml-1" />
                        אימייל
                      </label>
                      <input
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="admin-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline ml-1" />
                        שעות פעילות
                      </label>
                      <input
                        type="text"
                        value={businessInfo.hours}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, hours: e.target.value }))}
                        className="admin-input"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="admin-button">
                    <Save className="w-4 h-4 ml-2" />
                    שמור שינויים
                  </button>
                </form>
              </div>
            )}

            {/* Design Settings */}
            {activeTab === 'design' && (
              <div className="admin-card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Palette className="w-6 h-6" />
                  עיצוב ותוכן
                </h2>

                <div className="space-y-8">
                  {/* Colors */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">צבעי האתר</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">צבע ראשי</label>
                        <input
                          type="color"
                          value={siteSettings.primaryColor}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="color-picker"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">צבע משני</label>
                        <input
                          type="color"
                          value={siteSettings.secondaryColor}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="color-picker"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">צבע הדגשה</label>
                        <input
                          type="color"
                          value={siteSettings.accentColor}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="color-picker"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">גופן</h3>
                    <select
                      value={siteSettings.fontFamily}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="admin-input max-w-xs"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Heebo">Heebo</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Rubik">Rubik</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">תוכן האתר</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">כותרת ראשית</label>
                        <input
                          type="text"
                          value={siteSettings.heroTitle}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">תת כותרת</label>
                        <input
                          type="text"
                          value={siteSettings.heroSubtitle}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">כותרת אודות</label>
                        <input
                          type="text"
                          value={siteSettings.aboutTitle}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutTitle: e.target.value }))}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור אודות</label>
                        <textarea
                          value={siteSettings.aboutDescription}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutDescription: e.target.value }))}
                          className="admin-input"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={applySiteSettings}
                    className="admin-button"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    החל הגדרות
                  </button>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="admin-card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  SEO ושיווק
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">מילות מפתח</label>
                    <textarea
                      value={siteSettings.metaKeywords}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, metaKeywords: e.target.value }))}
                      className="admin-input"
                      rows={3}
                      placeholder="דלתות, דלת פלדה, דלת עץ..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">רשתות חברתיות</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">פייסבוק</label>
                        <input
                          type="url"
                          value={siteSettings.socialFacebook}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, socialFacebook: e.target.value }))}
                          className="admin-input"
                          placeholder="https://facebook.com/onlybest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">אינסטגרם</label>
                        <input
                          type="url"
                          value={siteSettings.socialInstagram}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, socialInstagram: e.target.value }))}
                          className="admin-input"
                          placeholder="https://instagram.com/onlybest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">וואטסאפ</label>
                        <input
                          type="tel"
                          value={siteSettings.socialWhatsapp}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, socialWhatsapp: e.target.value }))}
                          className="admin-input"
                          placeholder="+972583522191"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem('seoSettings', JSON.stringify({
                        metaKeywords: siteSettings.metaKeywords,
                        socialFacebook: siteSettings.socialFacebook,
                        socialInstagram: siteSettings.socialInstagram,
                        socialWhatsapp: siteSettings.socialWhatsapp
                      }));
                      alert('הגדרות SEO נשמרו בהצלחה!');
                    }}
                    className="admin-button"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    שמור הגדרות SEO
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Door Modal */}
      {showAddDoor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">הוסף דלת חדשה</h3>
              <button
                onClick={() => setShowAddDoor(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddDoor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">שם הדלת</label>
                  <input
                    type="text"
                    value={newDoor.name}
                    onChange={(e) => setNewDoor(prev => ({ ...prev, name: e.target.value }))}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={newDoor.slug}
                    onChange={(e) => setNewDoor(prev => ({ ...prev, slug: e.target.value }))}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">קטגוריה</label>
                  <select
                    value={newDoor.category}
                    onChange={(e) => setNewDoor(prev => ({ ...prev, category: e.target.value }))}
                    className="admin-input"
                    required
                  >
                    <option value="פנים">פנים</option>
                    <option value="חוץ">חוץ</option>
                    <option value="זכוכית">זכוכית</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">טווח מחירים</label>
                  <select
                    value={newDoor.price_range}
                    onChange={(e) => setNewDoor(prev => ({ ...prev, price_range: e.target.value }))}
                    className="admin-input"
                  >
                    <option value="₪ - נמוך">₪ - נמוך</option>
                    <option value="₪₪ - בינוני">₪₪ - בינוני</option>
                    <option value="₪₪₪ - גבוה">₪₪₪ - גבוה</option>
                    <option value="₪₪₪₪ - פרימיום">₪₪₪₪ - פרימיום</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">מחיר מדויק (אופציונלי)</label>
                  <input
                    type="number"
                    value={newDoor.price || ''}
                    onChange={(e) => setNewDoor(prev => ({ ...prev, price: e.target.value ? Number(e.target.value) : null }))}
                    className="admin-input"
                    placeholder="למשל: 2500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">עדיפות תצוגה (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newDoor.display_priority}
                    onChange={(e) => setNewDoor(prev => ({ ...prev, display_priority: Number(e.target.value) }))}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור קצר</label>
                <input
                  type="text"
                  value={newDoor.short_description}
                  onChange={(e) => setNewDoor(prev => ({ ...prev, short_description: e.target.value }))}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור מלא</label>
                <textarea
                  value={newDoor.description}
                  onChange={(e) => setNewDoor(prev => ({ ...prev, description: e.target.value }))}
                  className="admin-input"
                  rows={4}
                  required
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">סגנונות (בחר מספר)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['מודרני', 'קלאסי', 'תעשייתי', 'ביטחון', 'מקצועי', 'מינימליסטי'].map((style) => (
                    <label key={style} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newDoor.style?.includes(style) || false}
                        onChange={(e) => {
                          const currentStyles = newDoor.style || [];
                          if (e.target.checked) {
                            setNewDoor(prev => ({ ...prev, style: [...currentStyles, style] }));
                          } else {
                            setNewDoor(prev => ({ ...prev, style: currentStyles.filter(s => s !== style) }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תגיות (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={newDoor.tags?.join(', ') || ''}
                  onChange={(e) => setNewDoor(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  }))}
                  className="admin-input"
                  placeholder="בידוד גבוה, עמיד מזג אוויר, ביטחון"
                />
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">חומרים (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={newDoor.materials?.join(', ') || ''}
                  onChange={(e) => setNewDoor(prev => ({ 
                    ...prev, 
                    materials: e.target.value.split(',').map(material => material.trim()).filter(material => material) 
                  }))}
                  className="admin-input"
                  placeholder="פלדה, בידוד פוליאוריתן, עץ אלון"
                />
              </div>

              {/* Finishes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">גימורים (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={newDoor.finishes?.join(', ') || ''}
                  onChange={(e) => setNewDoor(prev => ({ 
                    ...prev, 
                    finishes: e.target.value.split(',').map(finish => finish.trim()).filter(finish => finish) 
                  }))}
                  className="admin-input"
                  placeholder="אפוקסי, צבע אנטי קורוזיה, לכה שקופה"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">צבעים זמינים (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={newDoor.colors?.join(', ') || ''}
                  onChange={(e) => setNewDoor(prev => ({ 
                    ...prev, 
                    colors: e.target.value.split(',').map(color => color.trim()).filter(color => color) 
                  }))}
                  className="admin-input"
                  placeholder="שחור, חום, לבן, עץ טבעי"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">מידות זמינות (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={newDoor.sizes?.join(', ') || ''}
                  onChange={(e) => setNewDoor(prev => ({ 
                    ...prev, 
                    sizes: e.target.value.split(',').map(size => size.trim()).filter(size => size) 
                  }))}
                  className="admin-input"
                  placeholder="80x200, 90x210, 100x210"
                />
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תוספות (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={newDoor.addons?.join(', ') || ''}
                  onChange={(e) => setNewDoor(prev => ({ 
                    ...prev, 
                    addons: e.target.value.split(',').map(addon => addon.trim()).filter(addon => addon) 
                  }))}
                  className="admin-input"
                  placeholder="ידית מעוצבת, מנעול רב בריח, עינית פנורמית"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תמונות</label>
                <div className="space-y-4">
                  {newDoor.images?.map((image, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img src={image.url} alt={image.alt} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => {
                            const updatedImages = [...(newDoor.images || [])];
                            updatedImages[index] = { ...updatedImages[index], alt: e.target.value };
                            setNewDoor(prev => ({ ...prev, images: updatedImages }));
                          }}
                          className="admin-input"
                          placeholder="תיאור התמונה"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedImages = newDoor.images?.filter((_, i) => i !== index) || [];
                          setNewDoor(prev => ({ ...prev, images: updatedImages }));
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const imageData = await handleImageUpload(file);
                            setNewDoor(prev => ({ 
                              ...prev, 
                              images: [...(prev.images || []), imageData] 
                            }));
                          } catch (error) {
                            alert('שגיאה בהעלאת התמונה');
                          }
                        }
                      }}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">לחץ להעלאת תמונה</p>
                      {uploading && <p className="text-blue-600 mt-2">מעלה תמונה...</p>}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newDoor.is_active}
                    onChange={(e) => setNewDoor(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">דלת פעילה</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="admin-button">
                  <Save className="w-4 h-4 ml-2" />
                  שמור דלת
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDoor(false)}
                  className="admin-button-danger"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Door Modal */}
      {editingDoor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">עריכת דלת</h3>
              <button
                onClick={() => setEditingDoor(null)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateDoor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">שם הדלת</label>
                  <input
                    type="text"
                    value={editingDoor.name}
                    onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={editingDoor.slug}
                    onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">קטגוריה</label>
                  <select
                    value={editingDoor.category}
                    onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                    className="admin-input"
                    required
                  >
                    <option value="פנים">פנים</option>
                    <option value="חוץ">חוץ</option>
                    <option value="זכוכית">זכוכית</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">טווח מחירים</label>
                  <select
                    value={editingDoor.price_range}
                    onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, price_range: e.target.value }) : null)}
                    className="admin-input"
                  >
                    <option value="₪ - נמוך">₪ - נמוך</option>
                    <option value="₪₪ - בינוני">₪₪ - בינוני</option>
                    <option value="₪₪₪ - גבוה">₪₪₪ - גבוה</option>
                    <option value="₪₪₪₪ - פרימיום">₪₪₪₪ - פרימיום</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">מחיר מדויק (אופציונלי)</label>
                  <input
                    type="number"
                    value={editingDoor.price || ''}
                    onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, price: e.target.value ? Number(e.target.value) : null }) : null)}
                    className="admin-input"
                    placeholder="למשל: 2500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">עדיפות תצוגה (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingDoor.display_priority}
                    onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, display_priority: Number(e.target.value) }) : null)}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור קצר</label>
                <input
                  type="text"
                  value={editingDoor.short_description}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, short_description: e.target.value }) : null)}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור מלא</label>
                <textarea
                  value={editingDoor.description}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  className="admin-input"
                  rows={4}
                  required
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">סגנונות (בחר מספר)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['מודרני', 'קלאסי', 'תעשייתי', 'ביטחון', 'מקצועי', 'מינימליסטי'].map((style) => (
                    <label key={style} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingDoor.style?.includes(style) || false}
                        onChange={(e) => {
                          const currentStyles = editingDoor.style || [];
                          if (e.target.checked) {
                            setEditingDoor(prev => prev ? ({ ...prev, style: [...currentStyles, style] }) : null);
                          } else {
                            setEditingDoor(prev => prev ? ({ ...prev, style: currentStyles.filter(s => s !== style) }) : null);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תגיות (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={editingDoor.tags?.join(', ') || ''}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  }) : null)}
                  className="admin-input"
                  placeholder="בידוד גבוה, עמיד מזג אוויר, ביטחון"
                />
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">חומרים (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={editingDoor.materials?.join(', ') || ''}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ 
                    ...prev, 
                    materials: e.target.value.split(',').map(material => material.trim()).filter(material => material) 
                  }) : null)}
                  className="admin-input"
                  placeholder="פלדה, בידוד פוליאוריתן, עץ אלון"
                />
              </div>

              {/* Finishes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">גימורים (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={editingDoor.finishes?.join(', ') || ''}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ 
                    ...prev, 
                    finishes: e.target.value.split(',').map(finish => finish.trim()).filter(finish => finish) 
                  }) : null)}
                  className="admin-input"
                  placeholder="אפוקסי, צבע אנטי קורוזיה, לכה שקופה"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">צבעים זמינים (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={editingDoor.colors?.join(', ') || ''}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ 
                    ...prev, 
                    colors: e.target.value.split(',').map(color => color.trim()).filter(color => color) 
                  }) : null)}
                  className="admin-input"
                  placeholder="שחור, חום, לבן, עץ טבעי"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">מידות זמינות (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={editingDoor.sizes?.join(', ') || ''}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ 
                    ...prev, 
                    sizes: e.target.value.split(',').map(size => size.trim()).filter(size => size) 
                  }) : null)}
                  className="admin-input"
                  placeholder="80x200, 90x210, 100x210"
                />
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תוספות (הפרד בפסיקים)</label>
                <input
                  type="text"
                  value={editingDoor.addons?.join(', ') || ''}
                  onChange={(e) => setEditingDoor(prev => prev ? ({ 
                    ...prev, 
                    addons: e.target.value.split(',').map(addon => addon.trim()).filter(addon => addon) 
                  }) : null)}
                  className="admin-input"
                  placeholder="ידית מעוצבת, מנעול רב בריח, עינית פנורמית"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תמונות</label>
                <div className="space-y-4">
                  {editingDoor.images?.map((image, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img src={image.url} alt={image.alt} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => {
                            const updatedImages = [...(editingDoor.images || [])];
                            updatedImages[index] = { ...updatedImages[index], alt: e.target.value };
                            setEditingDoor(prev => prev ? ({ ...prev, images: updatedImages }) : null);
                          }}
                          className="admin-input"
                          placeholder="תיאור התמונה"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedImages = editingDoor.images?.filter((_, i) => i !== index) || [];
                          setEditingDoor(prev => prev ? ({ ...prev, images: updatedImages }) : null);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const imageData = await handleImageUpload(file);
                            setEditingDoor(prev => prev ? ({ 
                              ...prev, 
                              images: [...(prev.images || []), imageData] 
                            }) : null);
                          } catch (error) {
                            alert('שגיאה בהעלאת התמונה');
                          }
                        }
                      }}
                      className="hidden"
                      id="editImageUpload"
                    />
                    <label htmlFor="editImageUpload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">לחץ להעלאת תמונה</p>
                      {uploading && <p className="text-blue-600 mt-2">מעלה תמונה...</p>}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingDoor.is_active}
                    onChange={(e) => setEditingDoor(prev => prev ? ({ ...prev, is_active: e.target.checked }) : null)}
                    className="rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">דלת פעילה</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="admin-button">
                  <Save className="w-4 h-4 ml-2" />
                  עדכן דלת
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDoor(null)}
                  className="admin-button-danger"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;