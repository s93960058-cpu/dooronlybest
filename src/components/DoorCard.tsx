import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Door } from "../types";
import { MessageCircle, Eye, Info, Palette, Ruler, Wrench, Star, ChevronDown, ChevronUp } from "lucide-react";
import { createWhatsAppUrl, getWhatsAppMessage } from "../utils/whatsapp";
import { useFirestore } from "../hooks/useFirestore";
import { businessInfo as defaultBusinessInfo } from "../data/business";
import { BusinessInfo } from "../types";
import ImageModal from "./ImageModal";

interface DoorCardProps {
  door: Door;
  showFullDetails?: boolean;
}

const DoorCard: React.FC<DoorCardProps> = ({ door, showFullDetails = false }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDetails, setShowDetails] = useState(showFullDetails);
  const { data: businessData } = useFirestore<BusinessInfo>("business");
  const business = businessData.length > 0 ? businessData[0] : defaultBusinessInfo;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = getWhatsAppMessage("catalog", door?.name);
    const whatsappUrl = createWhatsAppUrl(business?.whatsapp || "", message);
    window.open(whatsappUrl, "_blank");
  };

  const firstImage = door?.images?.[0];
  const tags = door?.tags ?? [];
  const materials = door?.materials ?? [];
  const colors = door?.colors ?? [];
  const sizes = door?.sizes ?? [];
  const addons = door?.addons ?? [];

  return (
    <>
      <div className="door-card group">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={firstImage?.url || "/placeholder-door.jpg"}
            alt={firstImage?.alt || door?.name || "Door image"}
            className="door-card-image"
            loading="lazy"
          />

          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowImageModal(true);
                    }}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                    title="צפה בתמונה מלאה"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(!showDetails);
                    }}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                    title={showDetails ? "הסתר פרטים" : "הצג פרטים"}
                  >
                    {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="badge-primary shadow-lg backdrop-blur-sm">
              {door?.category}
            </span>
          </div>

          {/* Premium Priority Badge */}
          {door?.display_priority && door.display_priority > 8 && (
            <div className="absolute top-4 left-4">
              <span className="badge-gold shadow-lg backdrop-blur-sm">
                <Star className="w-3 h-3 ml-1" />
                מומלץ
              </span>
            </div>
          )}
        </div>

        {/* Premium Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
              {door?.name}
            </h3>
            {door?.short_description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {door.short_description}
              </p>
            )}
          </div>

          {/* Premium Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="badge-primary text-xs shadow-sm"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="badge-gray text-xs">
                  +{tags.length - 3} נוספים
                </span>
              )}
            </div>
          )}

          {/* Premium Details Section */}
          {showDetails && (
            <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-blue-100 shadow-inner">
              {door?.description && (
                <p className="text-gray-700 mb-5 leading-relaxed font-medium">
                  {door.description}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4">
                {materials.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Wrench className="w-4 h-4 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-blue-800 text-sm block mb-1">חומרים</span>
                      <span className="text-gray-600 text-sm">{materials.join(", ")}</span>
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Palette className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-emerald-800 text-sm block mb-1">צבעים זמינים</span>
                      <span className="text-gray-600 text-sm">{colors.join(", ")}</span>
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Ruler className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-amber-800 text-sm block mb-1">מידות</span>
                      <span className="text-gray-600 text-sm">{sizes.join(", ")} ס"מ</span>
                    </div>
                  </div>
                )}

                {addons.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-700" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-yellow-800 text-sm block mb-1">תוספות</span>
                      <span className="text-gray-600 text-sm">{addons.join(", ")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/catalog/${door?.slug}`}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                לפרטים מלאים ←
              </Link>
            </div>

            {/* Premium Contact Button */}
            <button
              onClick={handleWhatsAppClick}
              className="btn-contact shadow-lg hover:shadow-xl"
              title="פנייה בווטסאפ"
            >
              <MessageCircle className="w-4 h-4" />
              <span>צרו קשר</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Image Modal */}
      {showImageModal && (
        <ImageModal
          images={door?.images ?? []}
          currentIndex={0}
          onClose={() => setShowImageModal(false)}
          title={door?.name ?? ""}
        />
      )}
    </>
  );
};

export default DoorCard;
