"use client";
import React, { useState } from "react";
import {
  Map,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapLocateControl,
  MapMarker,
  MapPopup,
  MapTooltip,
  MapTileLayer,
  MapZoomControl,
} from "@/components/ui/map";
import { Search, X, MapPin } from "lucide-react";
import { useMap } from "react-leaflet";

function MapFlyTo({ position }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 18, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}
function MapPanes() {
  const map = useMap();
  React.useEffect(() => {
    if (!map.getPane("labels")) {
      const pane = map.createPane("labels");
      pane.style.zIndex = 650; // au-dessus des tiles normales
      pane.style.pointerEvents = "none"; // pour ne pas bloquer les clics
    }
  }, [map]);
  return null;
}

export default function GeoLocalistion() {
  const [myCoordinates, setMyCoordinates] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const TYPE = [
    {
      name: "CT",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-10 text-secondary drop-shadow-xl"
        >
          <path
            fillRule="evenodd"
            d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      places: [
        {
          name: "CT KAREHE",
          coordinates: [-3.3896077, 29.9255809],
          type: "CT",
          address: "Zone Karehe, Commune Buyenzi",
          stockCA: 12500,
          stockCB: 4500,
          farmersCount: 342,
        },
        {
          name: "CT KIGUSU",
          coordinates: [-3.3896077, 29.9255809],
          type: "CT",
          address: "Zone Kigusu, Commune Buyenzi",
          stockCA: 8900,
          stockCB: 2100,
          farmersCount: 156,
        },
      ],
    },
    {
      name: "SDL",
      coordinates: [-3.3896077, 29.9755819],
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-10 text-red-500 drop-shadow-xl"
        >
          <path
            fillRule="evenodd"
            d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      places: [
        {
          name: "SDL GATABO",
          coordinates: [-3.3896077, 29.9755819],
          type: "SDL",
          address: "Zone Gatabo, Commune Kayanza",
          stockCA: 5600,
          stockCB: 1200,
          farmersCount: 89,
        },
        {
          name: "SDL KIGENGE",
          coordinates: [-3.3896077, 29.9755819],
          type: "SDL",
          address: "Zone Kigenge, Commune Ngozi",
          stockCA: 7800,
          stockCB: 2300,
          farmersCount: 112,
        },
      ],
    },
    {
      name: "UDP",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-10 text-yellow-500 drop-shadow-xl"
        >
          <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
          <path
            fillRule="evenodd"
            d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
            clipRule="evenodd"
          />
          <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
        </svg>
      ),
      places: [
        {
          name: "UDP CAFO",
          coordinates: [-3.3896077, 29.90005829],
          type: "UDP",
          address: "Zone Cafo, Commune Gitega",
          stockCafeVert: 25000,
        },
        {
          name: "UDP KAWA",
          coordinates: [-3.3896077, 29.9995829],
          type: "UDP",
          address: "Zone Kawa, Commune Ngozi",
          stockCafeVert: 18000,
        },
      ],
    },
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = [];
    TYPE.forEach((type) => {
      type.places.forEach((place) => {
        if (place.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(place);
        }
      });
    });
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectResult = (place) => {
    setSelectedPosition(place.coordinates);
    setSearchQuery(place.name);
    setSearchResults([]);
    setSelectedPlace(place);
  };

  return (
    <div className="lg:h-[calc(90vh-64px)] h-[calc(100vh-64px)] w-full relative">
      <div className="absolute top-4 left-4 z-1000 w-full max-w-sm flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher CT/SDL/UDP..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-12 pl-12 pr-10 bg-white dark:bg-zinc-800 shadow-lg rounded-xl text-sm  focus:outline-hidden placeholder:text-gray-400"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="size-5" />
          </div>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectResult(result)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700/50 text-left transition-colors border-b border-gray-50 last:border-0"
              >
                <MapPin className="size-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {result.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Selected Place Details Panel */}
        {selectedPlace && (
          <div className="w-full bg-white/90 dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="relative h-24 bg-linear-to-r from-primary/40 to-transparent p-4">
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white text-gray-500 transition-colors"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-end h-full gap-4">
                <div className="mb-1 text-white">
                  {TYPE.find((t) => t.name === selectedPlace.type)?.icon}
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider text-secondary uppercase bg-white/80 px-2 py-0.5 rounded-md mb-1 inline-block">
                    {selectedPlace.type}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectedPlace.name}
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <MapPin className="size-4 text-gray-400 mt-0.5 shrink-0" />
                  {selectedPlace.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-200 dark:border-zinc-800">
                {selectedPlace.type === "UDP" ? (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500  uppercase tracking-wider mb-1">
                      Stock Café Vert
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPlace.stockCafeVert?.toLocaleString()}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        kg
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-100 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-dashed">
                      <p className="text-[10px] text-gray-500  uppercase mb-1">
                        Stock CA
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {selectedPlace.stockCA?.toLocaleString()}{" "}
                        <span className="text-[10px] font-normal text-gray-500">
                          kg
                        </span>
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-dashed">
                      <p className="text-[10px] text-gray-500  uppercase mb-1">
                        Stock CB
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {selectedPlace.stockCB?.toLocaleString()}{" "}
                        <span className="text-[10px] font-normal text-gray-500">
                          kg
                        </span>
                      </p>
                    </div>
                    <div className="col-span-2 mt-1">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <span className="text-xs text-gray-500 font-medium">
                          Caféiculteurs
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {selectedPlace.farmersCount}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="px-4 pb-4">
              <button className="w-full py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
                Voir {selectedPlace.name}
              </button>
            </div>
          </div>
        )}
      </div>

      <Map
        center={[-3.3896077, 29.9255829]}
        zoom={9}
        className="h-full w-full rounded-none"
      >
        {/* ✅ Important : créer le pane labels */}
        <MapPanes />
        {selectedPosition && <MapFlyTo position={selectedPosition} />}

        <MapLayers defaultLayerGroups={TYPE.map((place) => place.name)}>
          <MapTileLayer />
          <MapLayerGroup name="Satellite (Street)">
            <MapTileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <MapTileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              zIndex={999}
              pane="labels"
            />
          </MapLayerGroup>
          <MapTileLayer
            name="No Labels"
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            darkUrl="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />

          <div className="absolute top-20 lg:top-4 right-4 z-1000 flex flex-col gap-2 items-center">
            <MapLayersControl className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg size-10 flex items-center justify-center relative top-0 right-0" />
            <MapLocateControl
              onLocationFound={(location) => setMyCoordinates(location.latlng)}
              onLocationError={(error) => toast.error(error.message)}
              watch
              className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg size-10 flex items-center justify-center relative bottom-0 right-0"
            />
            <MapZoomControl className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg flex flex-col items-center relative top-0 left-0" />
          </div>

          {TYPE.map((placesGroup) => (
            <MapLayerGroup key={placesGroup.name} name={placesGroup.name}>
              {placesGroup.places.map((place) => (
                <MapMarker
                  key={place.name}
                  position={place.coordinates}
                  icon={placesGroup.icon}
                  eventHandlers={{
                    click: () => {
                      handleSelectResult(place);
                    },
                    mouseover: (e) => {
                      e.target.openTooltip();
                    },
                    mouseout: (e) => {
                      e.target.closeTooltip();
                    },
                  }}
                >
                  <MapTooltip
                    direction="top"
                    offset={[0, -20]}
                    opacity={1}
                    className="font-bold text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-0 shadow-lg px-3 py-1.5 rounded-lg"
                  >
                    {place.name}
                  </MapTooltip>
                </MapMarker>
              ))}
            </MapLayerGroup>
          ))}
        </MapLayers>

        {myCoordinates && (
          <MapPopup
            position={myCoordinates}
            offset={[0, -5]}
            className="w-56 rounded-xl shadow-xl"
          >
            {myCoordinates.toString()}
          </MapPopup>
        )}
      </Map>
    </div>
  );
}
