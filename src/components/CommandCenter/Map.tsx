import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

// TopoJSON source
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

interface MapChartProps {
  voteData: Record<string, { yes: number; no: number }>;
  onCountrySelect: (name: string, id: string) => void;
  selectedCountryId?: string | null;
}

const MapChart = ({ voteData, onCountrySelect, selectedCountryId }: MapChartProps) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  // Determine fill color based on data
  const getFillColor = (id: string, isHovered: boolean) => {
    if (isHovered) return "#94a3b8"; // Slate 400 (Hover state)

    const stats = voteData[id];

    if (!stats) return "#334155"; // Slate-700 for no data
    if (selectedCountryId === id) return "#fbbf24"; // Amber-400 for selection highlight

    // Simple majority logic
    if (stats.yes > stats.no) return "#2563EB"; // Liberation Blue
    if (stats.no > stats.yes) return "#DC2626"; // Resistance Red

    return "#334155"; // Tie or 0
  };

  return (
    <div className="w-full h-full bg-slate-900 overflow-hidden relative rounded-xl border border-slate-800">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={(position) => setPosition(position)}
          maxZoom={4}
          minZoom={0.8}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Ensure strict string comparison
                const currentId = String(geo.id);
                const isHovered = hoveredCountryId === currentId;

                return (
                  <Geography
                    // Force re-render when hover state changes to ensure synchronized styling
                    key={`${geo.rsmKey}-${isHovered ? 'hover' : 'idle'}`}
                    geography={geo}
                    onMouseEnter={() => {
                      setHoveredCountryId(currentId);
                      setTooltipContent(geo.properties.name);
                    }}
                    onMouseLeave={() => {
                      setHoveredCountryId(null);
                      setTooltipContent('');
                    }}
                    onClick={() => {
                      onCountrySelect(geo.properties.name, currentId);
                    }}
                    style={{
                      default: {
                        fill: getFillColor(currentId, isHovered),
                        stroke: isHovered ? "#f8fafc" : "#1e293b",
                        strokeWidth: isHovered ? 1.5 : 0.5,
                        outline: "none",
                        transition: "all 0.1s ease-in-out"
                      },
                      hover: {
                        fill: "#94a3b8", // Slate 400
                        stroke: "#f8fafc",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 0.1s ease-in-out"
                      },
                      pressed: {
                        fill: "#fbbf24",
                        stroke: "#f8fafc",
                        strokeWidth: 1.5,
                        outline: "none",
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs px-2 py-1 rounded border border-slate-700 pointer-events-none backdrop-blur z-10">
          {tooltipContent}
        </div>
      )}

      {/* Data Source Attribution & Disclaimer */}
      <div className="absolute bottom-16 left-4 z-10 max-w-xs text-[10px] text-slate-500 bg-slate-900/80 p-2 rounded border border-slate-800 backdrop-blur">
        <p className="mb-1 font-bold text-slate-400">DISCLAIMER:</p>
        <p className="leading-tight mb-1">
          Geographic borders are sourced from a third-party dataset and do not reflect the political stance of Project 51.
        </p>
        <p>
          Source: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="text-liberation-blue hover:text-white underline font-bold transition-colors">Natural Earth</a>
        </p>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center bg-slate-800 text-white rounded hover:bg-slate-700 border border-slate-700 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.2, 4) }));
          }}
        >
          +
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center bg-slate-800 text-white rounded hover:bg-slate-700 border border-slate-700 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.2, 0.8) }));
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default MapChart;
