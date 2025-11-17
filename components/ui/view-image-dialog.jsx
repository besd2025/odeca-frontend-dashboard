import React, { useEffect, useState } from "react";
// import LoadingDots from "../loading/loading_dots";

const ViewImageModal = ({ isOpen, onClose, imageUrl, alt }) => {
  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setImageError(false);
    setIsLoading(true);
  }, [imageUrl, isOpen]);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);
  const handleRotation = () => setRotation((r) => (r + 90) % 360);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-999999">
      <div className="relat/ive max-w-full max-h-full p-4">
        {(isLoading || !imageUrl) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            {/* <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"
              role="status"
              aria-label="Loading image"
            /> */}
            {/* <LoadingDots /> */}
          </div>
        )}
        {/* Zoom controls */}
        <div className="absolute top-12 left-12 flex gap-2 z-10">
          <button
            onClick={handleZoomOut}
            className="bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label="Zoom out"
            type="button"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label="Reset zoom"
            type="button"
          >
            {zoom}x
          </button>
          <button
            onClick={handleZoomIn}
            className="bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label="Zoom in"
            type="button"
          >
            +
          </button>
          <button
            onClick={handleRotation}
            className="bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label="Rotate"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={() => {
            onClose();
            handleReset();
          }}
          className="absolute right-12 top-12 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 focus:outline-none"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <img
          src={imageUrl}
          alt={alt || "Image"}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transition: "transform 0.2s",
            display: isLoading ? "none" : "block",
          }}
          className="max-w-[90vw] max-h-[80vh] w-auto h-auto rounded shadow-lg object-contain mx-auto"
        />
      </div>
    </div>
  );
};

export default ViewImageModal;
