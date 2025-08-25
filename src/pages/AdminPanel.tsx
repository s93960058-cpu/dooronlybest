import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
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
  Star
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { Door, ContactForm, BusinessInfo } from '../types';
import { useImageUpload } from '../hooks/useImageUpload';

const AdminPanel: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');
  
  // Auto-setup Firebase collections
  useFirebaseSetup();
  
  const { data: doors, loading: doorsLoading, addItem: addDoor, updateItem: updateDoor, deleteItem: deleteDoor } = useFirestore<Door>('doors');
  const { data: contacts, loading: contactsLoading, updateItem: updateContact, deleteItem: deleteContact } = useFirestore<ContactForm>('contacts');
  const { data: reviews, loading: reviewsLoading, updateItem: updateReview, deleteItem: deleteReview } = useFirestore<Review>('reviews');
  const { data: businessSettings, loading: businessLoading, updateItem: updateBusiness } = useFirestore<BusinessInfo>('business');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'catalog', name: 'ניהול קטלוג', icon: Package },
    { id: 'contacts', name: 'פניות לקוחות', icon: MessageSquare },
    { id: 'reviews', name: 'ניהול ביקורות', icon: Star },
    { id: 'settings', name: 'הגדרות עסק', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">פאנל ניהול - Only Best</h1>
            <button
              onClick={logout}
              className="flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-800"
            >
              <LogOut className="w-5 h-5" />
              <span>יציאה</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-orange-100 text-orange-800 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
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
            {activeTab === 'settings' && (
              <BusinessSettings 
                settings={businessSettings[0]} 
                loading={businessLoading}
                onUpdate={updateBusiness} 
              />
            )}
          </div>
        </div>
      </div>
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