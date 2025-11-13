
import React from 'react';
import { MapPin } from 'lucide-react';

const MapPreview: React.FC<{ address?: string }> = ({ address }) => {
  const mapImageUrl = `https://picsum.photos/seed/${address || 'map'}/600/300`;

  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 aspect-video">
      {address ? (
        <img src={mapImageUrl} alt={`Map preview for ${address}`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <MapPin className="w-12 h-12 mb-2" />
          <p>Map preview will appear here</p>
        </div>
      )}
    </div>
  );
};

export default MapPreview;
