import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import   DoorCard  from '../components/DoorCard';
import { categories, styles, doorsData as staticDoorsData } from '../data/doors';
import { useFirestore } from '../hooks/useFirestore';
import { Door } from '../types';

const Catalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('כל הקטגוריות');
  const [selectedStyle, setSelectedStyle] = useState('כל הסגנונות');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data: firebaseDoors, loading } = useFirestore<Door>('doors');
  
  // Use Firebase data if available, otherwise fallback to static data
  const doorsData = firebaseDoors.length > 0 ? firebaseDoors : staticDoorsData;

  const filteredDoors = useMemo(() => {
    return doorsData.filter((door) => {
      const matchesSearch = door.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          door.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          door.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'כל הקטגוריות' || door.category === selectedCategory;
      const matchesStyle = selectedStyle === 'כל הסגנונות' || door.style.includes(selectedStyle);

      return matchesSearch && matchesCategory && matchesStyle && door.is_active;
    });
  }, [doorsData, searchTerm, selectedCategory, selectedStyle]);

  return (
    <>
      <Helmet>
        <title>קטלוג דלתות - Only Best | דלתות , עץ, זכוכית </title>
        <meta name="description" content="עיינו בקטלוג הדלתות המקיף של Only Best. דלתות פלדה, עץ, זכוכית, ביטחון וממ״ד באיכות גבוהה. התקנה מקצועית ואחריות מלאה." />
        <meta name="keywords" content="קטלוג דלתות, דלתות פלדה, דלתות עץ, דלתות זכוכית, דלתות ביטחון, דלתות ממד" />
        <meta property="og:title" content="קטלוג דלתות - Only Best" />
        <meta property="og:description" content="עיינו בקטלוג הדלתות המקיף של Only Best. דלתות פלדה, עץ, זכוכית, ביטחון וממ״ד באיכות גבוהה." />
        <meta property="og:image" content="/image.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            קטלוג הדלתות שלנו
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            מבחר עשיר של דלתות איכותיות לכל צורך 
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חיפוש דלתות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden bg-orange-800 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Filter className="w-5 h-5" />
              <span>מסננים</span>
            </button>

            {/* Filters (Desktop) */}
            <div className="hidden lg:flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {styles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {isFilterOpen && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {styles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'טוען...' : `נמצאו ${filteredDoors.length} דלתות`}
            {searchTerm && ` עבור "${searchTerm}"`}
          </p>
        </div>

        {/* Doors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">טוען דלתות...</p>
          </div>
        ) : filteredDoors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoors.map((door) => (
              <DoorCard key={door.id} door={door} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              לא נמצאו דלתות המתאימות לחיפוש שלכם
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('כל הקטגוריות');
                setSelectedStyle('כל הסגנונות');
              }}
              className="bg-orange-800 text-white px-6 py-3 rounded-lg hover:bg-orange-900 transition-colors duration-200"
            >
              נקה מסננים
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Catalog;