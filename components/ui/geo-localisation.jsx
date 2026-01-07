"use client";
import React, { useState, useEffect } from "react";
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
import { X, MapPin } from "lucide-react";
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

export default function GeoLocalisation({
  data = [],
  center = [-3.3896077, 29.9255829],
  zoom = 9,
  selectedPlace = null,
  onSelectPlace = () => {},
  onCloseDetails = () => {},
  flyToPosition = null,
  onLocateError = null,
  children,
  mainMap = false,
}) {
  const [myCoordinates, setMyCoordinates] = useState(null);

  // If flyToPosition changes, we might want to fly there.
  // MapFlyTo handles this if rendered.

  return (
    <div
      className={
        mainMap
          ? "lg:h-[calc(90vh-64px)] h-[calc(100vh-64px)] w-full relative"
          : "lg:h-[calc(70vh-64px)] h-[calc(100vh-64px)] w-full relative"
      }
    >
      {/* Search Bar or other overlays passed as children */}
      {children}

      <div className="absolute top-4 left-4 z-1000 w-full max-w-sm flex flex-col gap-4 pointer-events-none">
        {/* Wrapper for absolute elements on top-left, making sure they don't block map if empty. 
             But children might need pointer events.
             Actually, the children (search bar) are absolute positioned by caller usually. 
             If I render children here, I should just render them.
         */}
      </div>

      {/* Details Panel - Positioned absolutely */}
      {selectedPlace && (
        <div
          className={
            mainMap
              ? "absolute top-20 lg:top-24 left-4 z-1000 w-full max-w-sm flex flex-col gap-4"
              : "absolute top-20 lg:top-4 left-4 z-1000 w-full max-w-sm flex flex-col gap-4"
          }
        >
          {/* Adjusted top position to account for Search Bar if present, 
                but user's original code had search bar at top-4 and details panel *under* it?
                Original code: Search Bar relative, then Search Results, then Details Panel. 
                All inside absolute div top-4 left-4.
                
                If I separate them, I need to coordinate positions. 
                Or I can just render the Details Panel here strictly. 
                Usage: Use absolute positioning relative to the container.
            */}
          <div className="w-full bg-white/90 dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
            <div className="relative h-24 bg-linear-to-r from-primary/40 to-transparent p-4">
              <button
                onClick={() => {
                  if (onCloseDetails) onCloseDetails();
                  else onSelectPlace(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white text-gray-500 transition-colors"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-end h-full gap-4">
                <div className="mb-1 text-white">
                  {/* Find icon from data if possible, or use Place's own icon prop if we restructure */}
                  {data.find((t) => t.name === selectedPlace.type)?.icon}
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
        </div>
      )}

      <Map center={center} zoom={zoom} className="h-full w-full rounded-none">
        <MapPanes />
        {flyToPosition && <MapFlyTo position={flyToPosition} />}

        <MapLayers defaultLayerGroups={data.map((place) => place.name)}>
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
              onLocationError={(error) => {
                if (onLocateError) onLocateError(error);
                else console.error(error);
              }}
              watch
              className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg size-10 flex items-center justify-center relative bottom-0 right-0"
            />
            <MapZoomControl className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg flex flex-col items-center relative top-0 left-0" />
          </div>

          {data.map((placesGroup) => (
            <MapLayerGroup key={placesGroup.name} name={placesGroup.name}>
              {placesGroup.places.map((place) => (
                <MapMarker
                  key={place.name}
                  position={place.coordinates}
                  icon={placesGroup.mapIcon}
                  iconAnchor={[24, 48]}
                  eventHandlers={{
                    click: () => {
                      onSelectPlace(place);
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
                    offset={[0, -48]}
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
