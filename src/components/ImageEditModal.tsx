'use client';

import { useState, useEffect } from 'react';
import { Image, Info } from 'lucide-react';
import { usePreventScroll } from '@/hooks/usePreventScroll';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mainImage: string, additionalImages: string[]) => void;
  currentImages: string[];
}

export default function ImageEditModal({ isOpen, onClose, onSave, currentImages }: ImageEditModalProps) {
  const [showMainImagePopup, setShowMainImagePopup] = useState(false);
  const [showOtherImagesPopup, setShowOtherImagesPopup] = useState(false);
  const [tempMainImage, setTempMainImage] = useState<string>(() => currentImages[0] ?? '');
  const [tempAdditionalImages, setTempAdditionalImages] = useState<string[]>(() => currentImages.length > 1 ? currentImages.slice(1) : []);
  const [originalMainImage, setOriginalMainImage] = useState<string>('');
  const [originalAdditionalImages, setOriginalAdditionalImages] = useState<string[]>([]);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showRemoveAllInfo, setShowRemoveAllInfo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize images when modal opens
  useEffect(() => {
    if (isOpen && currentImages.length > 0) {
      setTempMainImage(currentImages[0]);
      setTempAdditionalImages(currentImages.slice(1));
    } else {
      setTempMainImage('');
      setTempAdditionalImages([]);
    }
  }, [isOpen, currentImages]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Block background scroll when modal or nested popups are open
  usePreventScroll(isOpen || showMainImagePopup || showOtherImagesPopup || showDeleteAllConfirm || showRemoveAllInfo);

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempMainImage(base64String);
      };
      reader.readAsDataURL(file);
      // Reset file input to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleAdditionalImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((base64Images) => {
        // Filter out duplicates
        const newImages = base64Images.filter(img => !tempAdditionalImages.includes(img));
        setTempAdditionalImages(prev => [...prev, ...newImages]);
        // Reset file input
        event.target.value = '';
      });
    }
  };

  const handleMainImagePopupOk = () => {
    setShowMainImagePopup(false);
  };

  const handleOtherImagesPopupOk = () => {
    setShowOtherImagesPopup(false);
  };

  const removeTempAdditionalImage = (index: number) => {
    setTempAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllTempAdditionalImages = () => {
    setTempAdditionalImages([]);
    // Reset file input
    const input = document.getElementById('additional-images-upload-popup') as HTMLInputElement;
    if (input) input.value = '';
  };

  // Long press handler for individual images
  const handleImageLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tempAdditionalImages.length > 0) {
      setShowDeleteAllConfirm(true);
    }
  };

  const handleConfirmDeleteAll = () => {
    removeAllTempAdditionalImages();
    setShowDeleteAllConfirm(false);
  };

  const handleCancelDeleteAll = () => {
    setShowDeleteAllConfirm(false);
  };

  const handleSave = () => {
    onSave(tempMainImage, tempAdditionalImages);
    onClose();
  };

  // Check if there are changes in the main popup
  const hasMainPopupChanges = () => {
    const originalMain = currentImages.length > 0 ? currentImages[0] : '';
    const originalAdditional = currentImages.length > 1 ? currentImages.slice(1) : [];
    
    const mainChanged = tempMainImage !== originalMain;
    const additionalChanged = 
      tempAdditionalImages.length !== originalAdditional.length ||
      tempAdditionalImages.some((img, idx) => img !== originalAdditional[idx]);
    
    return mainChanged || additionalChanged;
  };

  // Check if there are changes in the main image popup
  const hasMainImageChanges = () => {
    return tempMainImage !== originalMainImage;
  };

  // Check if there are changes in the other images popup
  const hasOtherImagesChanges = () => {
    if (tempAdditionalImages.length !== originalAdditionalImages.length) {
      return true;
    }
    return tempAdditionalImages.some((img, idx) => img !== originalAdditionalImages[idx]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Initial Choice Popup */}
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
        style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
          e.stopPropagation();
        }}
      >
        <div 
          className="rounded-xl p-6 w-full mx-4 shadow-2xl overflow-hidden max-w-md"
          style={{ backgroundColor: '#0071c2' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Property Images</h2>
          </div>

          {/* Choice Buttons */}
          <div className="space-y-4 mb-6">
            {/* Main Image Button */}
            <button
              type="button"
              onClick={() => {
                setOriginalMainImage(tempMainImage);
                if (!isMounted) {
                  setShowMainImagePopup(true);
                  return;
                }
                setTimeout(() => setShowMainImagePopup(true), 50);
              }}
              className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black"
              style={{ backgroundColor: 'white' }}
            >
              <Image size={20} />
              <span className="text-base whitespace-nowrap">Main image ({tempMainImage ? '1' : '0'})</span>
            </button>

            {/* Other Images Button */}
            <button
              type="button"
              onClick={() => {
                setOriginalAdditionalImages([...tempAdditionalImages]);
                setShowOtherImagesPopup(true);
              }}
              className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black"
              style={{ backgroundColor: 'white' }}
            >
              <Image size={20} />
              <span className="text-base whitespace-nowrap">Other images ({tempAdditionalImages.length})</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              onClick={handleSave}
              disabled={!hasMainPopupChanges()}
            >
              Submit
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Popup - Matching list-property form */}
      {showMainImagePopup && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="rounded-xl p-4 w-full mx-4 shadow-2xl overflow-hidden" 
            style={{ backgroundColor: '#0071c2', maxWidth: '24rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white">Edit Main Image</h3>
            </div>
            
            {/* Image Preview (if temp image exists) */}
            {tempMainImage && (
              <div className="mb-4">
                <img 
                  src={tempMainImage} 
                  alt="Main image preview" 
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
                id="main-image-upload-popup"
              />
              <button
                type="button"
                className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black"
                style={{ backgroundColor: 'white' }}
                onClick={() => {
                  document.getElementById('main-image-upload-popup')?.click();
                }}
              >
                <Image size={20} />
                <span className="text-base whitespace-nowrap">Change main image ({tempMainImage ? '1' : '0'})</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  onClick={handleMainImagePopupOk}
                  disabled={!hasMainImageChanges()}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                  onClick={() => {
                    // Restore original image and close popup (discard all changes)
                    setTempMainImage(originalMainImage);
                    setShowMainImagePopup(false);
                    // Reset file input
                    const input = document.getElementById('main-image-upload-popup') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Images Popup - Matching list-property form */}
      {showOtherImagesPopup && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="rounded-xl w-full mx-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" 
            style={{ backgroundColor: '#0071c2', maxWidth: '24rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="p-4 pb-2 flex-shrink-0 relative">
              <div className="flex items-center justify-center">
                <h3 className="text-xl font-bold text-white">Edit Other Images</h3>
              </div>
              {tempAdditionalImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRemoveAllInfo(true)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                  title="How to remove all images"
                >
                  <Info size={22} className="text-white" />
                </button>
              )}
            </div>
            
            {/* Images Preview - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4">
              {tempAdditionalImages.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-col gap-2">
                    {tempAdditionalImages.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <img 
                          src={image} 
                          alt={`Additional ${index + 1}`} 
                          className="w-3/4 h-32 object-cover rounded border"
                          onTouchStart={(e) => {
                            const timer = setTimeout(() => {
                              handleImageLongPress(e);
                            }, 800);
                            (e.currentTarget as HTMLElement & { longPressTimer?: NodeJS.Timeout }).longPressTimer = timer;
                          }}
                          onTouchEnd={(e) => {
                            const timer = (e.currentTarget as HTMLElement & { longPressTimer?: NodeJS.Timeout }).longPressTimer;
                            if (timer) {
                              clearTimeout(timer);
                              (e.currentTarget as HTMLElement & { longPressTimer?: NodeJS.Timeout }).longPressTimer = undefined;
                            }
                          }}
                          onTouchMove={(e) => {
                            const timer = (e.currentTarget as HTMLElement & { longPressTimer?: NodeJS.Timeout }).longPressTimer;
                            if (timer) {
                              clearTimeout(timer);
                              (e.currentTarget as HTMLElement & { longPressTimer?: NodeJS.Timeout }).longPressTimer = undefined;
                            }
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleImageLongPress(e);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeTempAdditionalImage(index)}
                          onDragStart={(e) => e.preventDefault()}
                          onMouseDown={(e) => {
                            // Prevent text selection on mouse down
                            if (e.detail > 1) {
                              e.preventDefault(); // Prevent double-click selection
                            }
                          }}
                          className="flex-1 px-4 py-2 text-white rounded-lg font-medium self-center text-2xl select-none outline-none focus:outline-none"
                          style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            WebkitTouchCallout: 'none',
                            WebkitTapHighlightColor: 'transparent',
                            outline: 'none',
                            touchAction: 'manipulation'
                          }}
                        >
                          <span 
                            style={{ 
                              transform: 'scaleX(1.3)', 
                              display: 'inline-block', 
                              userSelect: 'none'
                            }}
                          >
                            −
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Buttons - Fixed */}
            <div className="flex flex-col gap-2 p-4 pt-2 flex-shrink-0">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAdditionalImagesUpload}
                className="hidden"
                id="additional-images-upload-popup"
              />
              <button
                type="button"
                className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black"
                style={{ backgroundColor: 'white' }}
                onClick={() => {
                  document.getElementById('additional-images-upload-popup')?.click();
                }}
              >
                <Image size={20} />
                <span className="text-base whitespace-nowrap">{tempAdditionalImages.length > 0 ? 'Add more images' : 'Add images'} ({tempAdditionalImages.length})</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  onClick={handleOtherImagesPopupOk}
                  disabled={!hasOtherImagesChanges()}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                  onClick={() => {
                    // Restore original images and close popup (discard all changes)
                    setTempAdditionalImages([...originalAdditionalImages]);
                    setShowOtherImagesPopup(false);
                    // Reset file input
                    const input = document.getElementById('additional-images-upload-popup') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Popup */}
      {showDeleteAllConfirm && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelDeleteAll();
            }
            e.stopPropagation();
          }}
        >
          <div 
            className="rounded-xl p-6 w-full mx-4 shadow-2xl overflow-hidden max-w-sm"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="w-16 rounded-lg flex items-center justify-center border-white"
                  style={{ 
                    height: '3.5rem',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span 
                    className="text-white text-4xl font-bold"
                    style={{ 
                      transform: 'scaleX(1.3)', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    −
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Remove All Images</h3>
              <p className="text-white/80 text-sm">Are you sure you want to remove all images?</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={handleCancelDeleteAll}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove All Info Popup */}
      {showRemoveAllInfo && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRemoveAllInfo(false);
            }
            e.stopPropagation();
          }}
        >
          <div 
            className="rounded-xl p-4 w-full mx-4 shadow-2xl overflow-hidden max-w-sm"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-1.5">Long Press Gestures</h2>
              <p className="text-white/80 text-base"><span className="font-bold">Remove all images at once</span><br />by long pressing any image.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowRemoveAllInfo(false)}
              className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Ok, I got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
