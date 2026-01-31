
import React, { useState } from 'react';
import { POLES_TERRITOIRES_DATA, PoleData } from '../data/polesData';

interface SenegalMapProps {
  onPoleSelect: (pole: PoleData) => void;
  selectedPoleId?: string;
}

const SenegalMap: React.FC<SenegalMapProps> = ({ onPoleSelect, selectedPoleId }) => {
  const [hoveredPole, setHoveredPole] = useState<string | null>(null);

  // Chemins SVG simplifiés pour les 8 pôles (approximation pour démonstration)
  // Dans un cas réel, on utiliserait des coordonnées GeoJSON précises
  const polesPaths = [
    { id: "OUEST", d: "M 50 150 L 100 130 L 120 180 L 80 220 Z", color: POLES_TERRITOIRES_DATA["OUEST"].couleur },
    { id: "NORD", d: "M 100 130 L 250 50 L 350 80 L 300 150 L 150 160 Z", color: POLES_TERRITOIRES_DATA["NORD"].couleur },
    { id: "NORD_EST", d: "M 350 80 L 450 100 L 480 200 L 380 250 L 300 150 Z", color: POLES_TERRITOIRES_DATA["NORD_EST"].couleur },
    { id: "CENTRE_OUEST", d: "M 120 180 L 250 180 L 270 250 L 150 280 Z", color: POLES_TERRITOIRES_DATA["CENTRE_OUEST"].couleur },
    { id: "CENTRE", d: "M 250 180 L 380 250 L 350 350 L 220 320 Z", color: POLES_TERRITOIRES_DATA["CENTRE"].couleur },
    { id: "CENTRE_EST", d: "M 380 250 L 480 200 L 550 300 L 450 400 L 350 350 Z", color: POLES_TERRITOIRES_DATA["CENTRE_EST"].couleur },
    { id: "SUD_EST", d: "M 450 400 L 550 300 L 580 450 L 480 500 Z", color: POLES_TERRITOIRES_DATA["SUD_EST"].couleur },
    { id: "SUD_WEST", d: "M 150 280 L 270 250 L 350 350 L 300 450 L 100 400 Z", color: POLES_TERRITOIRES_DATA["SUD_WEST"].couleur },
  ];

  return (
    <div className="relative w-full h-[400px] bg-white rounded-xl shadow-inner p-4 flex items-center justify-center border border-gray-100 overflow-hidden">
      <svg
        viewBox="0 0 600 550"
        className="w-full h-full drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
      >
        {polesPaths.map((pole) => (
          <path
            key={pole.id}
            d={pole.d}
            fill={selectedPoleId === pole.id || hoveredPole === pole.id ? pole.color : `${pole.color}CC`}
            stroke="white"
            strokeWidth={selectedPoleId === pole.id ? "3" : "1.5"}
            className="transition-all duration-300 cursor-pointer hover:brightness-110"
            onMouseEnter={() => setHoveredPole(pole.id)}
            onMouseLeave={() => setHoveredPole(null)}
            onClick={() => onPoleSelect(POLES_TERRITOIRES_DATA[pole.id])}
          >
            <title>{POLES_TERRITOIRES_DATA[pole.id].nom}</title>
          </path>
        ))}
        
        {/* Points d'intérêt (Agropoles, Mines, etc.) */}
        <circle cx="80" cy="180" r="4" fill="#E11D48" /> {/* Dakar */}
        <circle cx="280" cy="220" r="4" fill="#7C3AED" /> {/* Agropole Centre */}
        <circle cx="500" cy="450" r="4" fill="#FBBF24" /> {/* Mines */}
      </svg>
      
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 text-[10px] space-y-1 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
          <span>Plateforme Industrielle</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
          <span>Agropole</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FBBF24]"></span>
          <span>Exploitation Minière</span>
        </div>
      </div>
      
      {hoveredPole && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-xl border border-blue-100 animate-in fade-in zoom-in duration-200">
          <p className="text-sm font-bold text-gray-900">{POLES_TERRITOIRES_DATA[hoveredPole].nom}</p>
          <p className="text-[10px] text-gray-500">{POLES_TERRITOIRES_DATA[hoveredPole].regions.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default SenegalMap;
