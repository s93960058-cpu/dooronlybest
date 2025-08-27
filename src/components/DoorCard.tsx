import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Door } from "../types";
import { MessageCircle, Eye, Info, Palette, Ruler, Wrench, Star } from "lucide-react";
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
  const [showDetails, setShowDetails] = useState(false);
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
      <div className="door-card group card-with-logo">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={firstImage?.url || "/placeholder-door.jpg"}
            alt={firstImage?.alt || door?.name || "Door image"}
            className="door-card-image"
            loading="lazy"
          />

          {/* Overlay with buttons */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(true);
                }}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                title="צפה בתמונה מלאה"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                title="פרטים נוספים"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {door?.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {door?.name}
            </h3>
            {door?.short_description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {door.short_description}
              </p>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium border border-blue-200 shadow-sm"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                  +{tags.length - 3} נוספים
                </span>
              )}
            </div>
          )}

          {/* Details Section */}
          {(showDetails || showFullDetails) && (
            <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-100 shadow-inner">
              {door?.description && (
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {door.description}
                </p>
              )}

              <div className="grid grid-cols-1 gap-3">
                {materials.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Wrench className="w-4 h-4 text-blue-700 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-blue-800 text-sm">חומרים: </span>
                      <span className="text-gray-600 text-sm">{materials.join(", ")}</span>
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Palette className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-emerald-800 text-sm">צבעים: </span>
                      <span className="text-gray-600 text-sm">{colors.join(", ")}</span>
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Ruler className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-amber-800 text-sm">מידות: </span>
                      <span className="text-gray-600 text-sm">{sizes.join(", ")} ס"מ</span>
                    </div>
                  </div>
                )}

                {addons.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-yellow-700 text-sm">תוספות: </span>
                      <span className="text-gray-600 text-sm">{addons.join(", ")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex flex-col">
              {door?.price_range && (
                <span className="text-lg font-bold text-blue-600">
                  {door.price_range}
                </span>
              )}
              <Link
                to={`/catalog/${door?.slug}`}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                לפרטים מלאים →
              </Link>
            </div>

            {/* Contact Button */}
            <button
              onClick={handleWhatsAppClick}
              className="btn-contact text-sm px-6 py-3 inline-flex items-center gap-2"
              title="פנייה בווטסאפ"
            >
              <MessageCircle className="w-4 h-4" />
              <span>צרו קשר</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
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