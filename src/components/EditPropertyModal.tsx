'use client';

import { useState, useEffect } from 'react';
import { PropertyFormData } from '@/utils/propertyUtils';
import { Image, MoreVertical } from 'lucide-react';
import { usePreventScroll } from '@/hooks/usePreventScroll';

// Ward data (same as list-property page)
const wardsByRegion = {
  'arusha': ['Arusha Central', 'Arusha North', 'Arusha South', 'Engaruka', 'Karatu', 'Kimandolu', 'Kisongo', 'Longido', 'Makuyuni', 'Mbuguni', 'Meru', 'Monduli', 'Mto wa Mbu', 'Ngaramtoni', 'Ngorongoro', 'Sakina', 'Tengeru', 'Themi', 'Unga Limited', 'Usa River', 'Other'],
  'dar-es-salaam': ['Buguruni', 'Chang\'ombe', 'Ilala', 'Kawe', 'Kariakoo', 'Kigamboni', 'Kijitonyama', 'Kinondoni', 'Kivukoni', 'Mbagala', 'Mbagala Kuu', 'Mbagala Rangi Tatu', 'Masaki', 'Mbezi', 'Mchikichini', 'Mikocheni', 'Msasani', 'Mtoni', 'Oyster Bay', 'Sinza', 'Tabata', 'Tandika', 'Temeke', 'Ubungo', 'Other'],
  'dodoma': ['Bahi', 'Chamwino', 'Chemba', 'Dodoma Central', 'Dodoma Urban', 'Hombolo', 'Kigwe', 'Kikombo', 'Kisese', 'Kongwa', 'Makutupora', 'Mlali', 'Mpwapwa', 'Mvumi', 'Ntyuka', 'Other'],
  'geita': ['Bukombe', 'Chato', 'Geita', 'Geita Town', 'Kakubilo', 'Katoro', 'Mabale', 'Mbogwe', 'Nyakabale', 'Nyang\'hwale', 'Other'],
  'iringa': ['Iringa Central', 'Iringa North', 'Iringa Urban', 'Kilolo', 'Kiponzelo', 'Mafinga', 'Mlowa', 'Mufindi', 'Other'],
  'kagera': ['Biharamulo', 'Bukoba', 'Bukoba Urban', 'Kanyigo', 'Karagwe', 'Kashasha', 'Kyerwa', 'Missenyi', 'Muleba', 'Ngara', 'Other'],
  'katavi': ['Karema', 'Mlele', 'Mpanda', 'Mpanda Town', 'Mpanda Urban', 'Other'],
  'kigoma': ['Buhigwe', 'Kakonko', 'Kasulu', 'Kibondo', 'Kigoma', 'Kigoma Urban', 'Uvinza', 'Other'],
  'kilimanjaro': ['Hai', 'Mawenzi', 'Moshi', 'Moshi Urban', 'Mwanga', 'Rombo', 'Same', 'Shirimatunda', 'Siha', 'Other'],
  'lindi': ['Kilwa', 'Kilwa Kivinje', 'Kilwa Masoko', 'Lindi', 'Lindi Urban', 'Liwale', 'Nachingwea', 'Ruangwa', 'Other'],
  'manyara': ['Babati', 'Babati Urban', 'Dareda', 'Hanang', 'Kiteto', 'Mbulu', 'Simanjiro', 'Other'],
  'mara': ['Bunda', 'Butiama', 'Musoma', 'Musoma Urban', 'Rorya', 'Serengeti', 'Tarime', 'Other'],
  'mbeya': ['Busokelo', 'Chunya', 'Ileje', 'Kyela', 'Mbarali', 'Mbeya', 'Mbeya Urban', 'Mbozi', 'Momba', 'Rungwe', 'Other'],
  'morogoro': ['Gairo', 'Kilombero', 'Kilosa', 'Malinyi', 'Morogoro', 'Morogoro Urban', 'Mvomero', 'Ulanga', 'Other'],
  'mtwara': ['Masasi', 'Masasi Urban', 'Mtwara', 'Mtwara Urban', 'Nanyumbu', 'Newala', 'Tandahimba', 'Other'],
  'mwanza': ['Ilemela', 'Kwimba', 'Magu', 'Misungwi', 'Mwanza Urban', 'Nyamagana', 'Sengerema', 'Ukerewe', 'Other'],
  'njombe': ['Ludewa', 'Makambako', 'Makete', 'Njombe', 'Njombe Urban', 'Wanging\'ombe', 'Other'],
  'pwani': ['Bagamoyo', 'Chalinze', 'Kibaha', 'Kibaha Urban', 'Kisarawe', 'Mafia', 'Mkuranga', 'Rufiji', 'Other'],
  'rukwa': ['Kalambo', 'Nkasi', 'Sumbawanga', 'Sumbawanga Urban', 'Other'],
  'ruvuma': ['Mbinga', 'Songea', 'Songea Urban', 'Tunduru', 'Other'],
  'shinyanga': ['Kahama', 'Kahama Urban', 'Kishapu', 'Msalala', 'Shinyanga', 'Shinyanga Urban', 'Other'],
  'simiyu': ['Bariadi', 'Busega', 'Itilima', 'Maswa', 'Meatu', 'Other'],
  'singida': ['Ikungi', 'Iramba', 'Manyoni', 'Mkalama', 'Singida', 'Singida Urban', 'Other'],
  'songwe': ['Ileje', 'Mbozi', 'Momba', 'Songwe', 'Other'],
  'tabora': ['Igunga', 'Kaliua', 'Nzega', 'Sikonge', 'Tabora', 'Tabora Urban', 'Urambo', 'Uyui', 'Other'],
  'tanga': ['Handeni', 'Handeni Urban', 'Kilindi', 'Korogwe', 'Korogwe Urban', 'Lushoto', 'Mkinga', 'Muheza', 'Pangani', 'Tanga', 'Tanga Urban', 'Other'],
  'unguja-north': ['Kaskazini A', 'Kaskazini B', 'Mkokotoni', 'Nungwi', 'Other'],
  'unguja-south': ['Kizimkazi', 'Kusini', 'Kusini Unguja', 'Makunduchi', 'Other'],
  'urban-west': ['Magharibi', 'Malindi', 'Mjini', 'Stone Town', 'Other'],
  'other': ['Other']
};

// Delete Confirmation Popup Component with countdown
function DeleteConfirmPopup({ 
  onConfirm, 
  onCancel
}: { 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onCancel();
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [onCancel]);

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ touchAction: 'none', minHeight: '100vh', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
        e.stopPropagation();
      }}
    >
      <div 
        className="rounded-xl p-4 w-full mx-4 shadow-2xl overflow-hidden max-w-sm"
        style={{ backgroundColor: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-black mb-1.5">Delete this property</h3>
          <p className="text-gray-600 text-sm">Are you sure you want to delete this property?</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-gray-800 rounded-lg font-medium transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyFormData | null;
  onDelete?: (propertyId: string) => void;
  onStageChanges?: (stagedProperty: PropertyFormData) => void;
  onCancel?: () => void;
}

export default function EditPropertyModal({ isOpen, onClose, property, onDelete, onStageChanges, onCancel }: EditPropertyModalProps) {
  const [formData, setFormData] = useState<PropertyFormData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [customWard, setCustomWard] = useState('');
  const [showWardPopup, setShowWardPopup] = useState(false);
  const [showMainImagePopup, setShowMainImagePopup] = useState(false);
  const [showOtherImagesPopup, setShowOtherImagesPopup] = useState(false);
  const [tempMainImage, setTempMainImage] = useState<string>('');
  const [tempAdditionalImages, setTempAdditionalImages] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [originalProperty, setOriginalProperty] = useState<PropertyFormData | null>(null);
  // Staged changes - only applied when Save Changes is clicked
  const [stagedFormData, setStagedFormData] = useState<PropertyFormData | null>(null);
  const [stagedRegion, setStagedRegion] = useState<string>('');
  const [stagedWard, setStagedWard] = useState<string>('');
  const [stagedCustomWard, setStagedCustomWard] = useState<string>('');
  const [stagedMainImage, setStagedMainImage] = useState<string>('');
  const [stagedAdditionalImages, setStagedAdditionalImages] = useState<string[]>([]);

  // Initialize form data when property changes
  useEffect(() => {
    if (property) {
      try {
        setFormData(property);
        setOriginalProperty(property);
        setSelectedRegion(property.region || '');
        setSelectedWard(property.ward || '');
        
        // Split images into main and additional
        if (property.images && property.images.length > 0) {
          setTempMainImage(property.images[0]);
          setTempAdditionalImages(property.images.slice(1));
        } else {
          setTempMainImage('');
          setTempAdditionalImages([]);
        }
        
        // Reset staged changes
        setStagedFormData(null);
        setStagedRegion('');
        setStagedWard('');
        setStagedCustomWard('');
        setStagedMainImage('');
        setStagedAdditionalImages([]);
      } catch (error) {
        console.error('Error initializing edit form:', error);
      }
    }
  }, [property]);

  // Block background scroll when modal or nested popups are open
  usePreventScroll(isOpen || showWardPopup || showMainImagePopup || showOtherImagesPopup || showDeleteConfirm);

  const handleInputChange = (field: keyof PropertyFormData, value: string | string[]) => {
    if (!formData) return;
    // Stage the change - don't update formData directly
    setStagedFormData(prev => {
      const base = prev || formData;
      return { ...base, [field]: value };
    });
  };

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempMainImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }
  };

  const handleAdditionalImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(base64Images => {
        setTempAdditionalImages(prev => {
          const uniqueNewImages = base64Images.filter(newImage => 
            !prev.some(existingImage => existingImage === newImage)
          );
          return [...prev, ...uniqueNewImages];
        });
      });
      event.target.value = '';
    }
  };

  const handleMainImagePopupOk = () => {
    // Stage the image changes
    setStagedMainImage(tempMainImage);
    setStagedAdditionalImages([...tempAdditionalImages]);
    setShowMainImagePopup(false);
  };

  const handleOtherImagesPopupOk = () => {
    // Stage the image changes
    setStagedMainImage(tempMainImage);
    setStagedAdditionalImages([...tempAdditionalImages]);
    setShowOtherImagesPopup(false);
  };

  const removeTempAdditionalImage = (index: number) => {
    setTempAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllTempAdditionalImages = () => {
    setTempAdditionalImages([]);
  };

  // Check if there are any staged changes
  const hasChanges = (): boolean => {
    if (!formData || !originalProperty) return false;

    // Use staged values if they exist, otherwise use current values
    const currentFormData = stagedFormData || formData;
    const currentRegion = stagedRegion || selectedRegion;
    const currentWard = stagedWard || selectedWard || stagedCustomWard || customWard;
    const currentMainImage = stagedMainImage !== '' ? stagedMainImage : tempMainImage;
    const currentAdditionalImages = stagedAdditionalImages.length > 0 ? stagedAdditionalImages : tempAdditionalImages;

    // Check form fields
    const fieldsToCheck: (keyof PropertyFormData)[] = [
      'title', 'description', 'price', 'bedrooms', 'bathrooms', 'squareFootage', 
      'contactName', 'contactPhone', 'contactEmail', 'status', 'propertyType', 'paymentPlan'
    ];
    
    for (const field of fieldsToCheck) {
      if (currentFormData[field] !== originalProperty[field]) {
        return true;
      }
    }

    // Check uploaderType separately (normalize empty string to undefined for comparison)
    const formUploaderType = (currentFormData.uploaderType === 'Broker' || currentFormData.uploaderType === 'Owner') ? currentFormData.uploaderType : undefined;
    const originalUploaderType = (originalProperty.uploaderType === 'Broker' || originalProperty.uploaderType === 'Owner') ? originalProperty.uploaderType : undefined;
    if (formUploaderType !== originalUploaderType) {
      return true;
    }

    // Check region and ward
    if (currentRegion !== originalProperty.region) return true;
    if (currentWard !== originalProperty.ward) return true;

    // Check images
    const currentImages = [currentMainImage, ...currentAdditionalImages].filter(img => img);
    const originalImages = originalProperty.images || [];
    
    if (currentImages.length !== originalImages.length) return true;
    
    for (let i = 0; i < currentImages.length; i++) {
      if (currentImages[i] !== originalImages[i]) {
        return true;
      }
    }

    return false;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !property || !hasChanges()) return;

    // Use staged values if they exist, otherwise use current values
    const finalFormData = stagedFormData || formData;
    const finalRegion = stagedRegion || selectedRegion;
    const finalWard = stagedWard || selectedWard || stagedCustomWard || customWard;
    const finalMainImage = stagedMainImage !== '' ? stagedMainImage : tempMainImage;
    const finalAdditionalImages = stagedAdditionalImages.length > 0 ? stagedAdditionalImages : tempAdditionalImages;

    const stagedProperty: PropertyFormData = {
      ...finalFormData,
      id: property.id, // Preserve ID
      createdAt: property.createdAt, // Preserve creation date
      images: [finalMainImage, ...finalAdditionalImages].filter(img => img),
      region: finalRegion,
      ward: finalWard,
      // Normalize uploaderType: empty string becomes undefined
      uploaderType: (finalFormData.uploaderType === 'Broker' || finalFormData.uploaderType === 'Owner') ? finalFormData.uploaderType : undefined,
    };

    // Stage the changes - don't save yet
    if (onStageChanges) {
      onStageChanges(stagedProperty);
    }
    // Close modal but don't clear editingProperty - it's needed for Update button
    onClose();
  };

  if (!isOpen || !property || !formData) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ minHeight: '100vh', height: '100%', touchAction: 'none' }}
    >
      <div 
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] xl:max-h-[95vh] overflow-y-auto shadow-2xl"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white pt-2 pb-2 px-4 flex items-center justify-center z-10 relative">
          <h2 className="text-2xl font-bold text-gray-900 px-4" style={{ paddingBottom: '0', lineHeight: '1.2', display: 'inline-block' }}>Edit Details</h2>
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteConfirm(true);
              }}
              className="absolute right-2 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
              title="Delete Property"
            >
              <MoreVertical size={24} />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="w-full px-1 sm:px-2 lg:px-4">
          {/* Basic Information Section */}
          <div className="text-center mb-1 mt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">
              Basic Information
            </h2>
          </div>

          {/* Basic Information Card */}
          <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-[22.5rem] xl:max-w-sm mx-auto">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2">
                <label className="block text-base font-bold text-white mb-2 text-center">
                  Property Type
                </label>
                <select 
                  className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                  value={(stagedFormData || formData).propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  required
                >
                  <option value="" className="text-gray-400">---</option>
                  <option value="1-bdrm-apartment">1 Bdrm apartment</option>
                  <option value="2-bdrm-apartment">2 Bdrm apartment</option>
                  <option value="3-bdrm-apartment">3 Bdrm apartment</option>
                  <option value="4-bdrm-apartment">4 Bdrm apartment</option>
                  <option value="5-bdrm-apartment">5 Bdrm apartment</option>
                  <option value="commercial-building-frame">Commercial building (Frame)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-base font-bold text-white mb-2 text-center">
                  Status
                </label>
                <select 
                  className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                  value={(stagedFormData || formData).status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="" className="text-gray-400">---</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="text-center mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">
              Location
            </h2>
          </div>

          {/* Location Card */}
          <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-[22.5rem] xl:max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-base font-bold text-white mb-2 text-center">
                  Region
                </label>
                <select 
                  className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                  value={stagedRegion || selectedRegion}
                  onChange={(e) => {
                    setStagedRegion(e.target.value);
                    setStagedWard('');
                    setStagedCustomWard('');
                    setSelectedRegion(e.target.value);
                    setSelectedWard('');
                    setCustomWard('');
                  }}
                  required
                >
                  <option value="" className="text-gray-400">---</option>
                    <option value="arusha">Arusha</option>
                    <option value="dar-es-salaam">Dar es Salaam</option>
                    <option value="dodoma">Dodoma</option>
                    <option value="geita">Geita</option>
                    <option value="iringa">Iringa</option>
                    <option value="kagera">Kagera</option>
                    <option value="katavi">Katavi</option>
                    <option value="kigoma">Kigoma</option>
                    <option value="kilimanjaro">Kilimanjaro</option>
                    <option value="lindi">Lindi</option>
                    <option value="manyara">Manyara</option>
                    <option value="mara">Mara</option>
                    <option value="mbeya">Mbeya</option>
                    <option value="morogoro">Morogoro</option>
                    <option value="mtwara">Mtwara</option>
                    <option value="mwanza">Mwanza</option>
                    <option value="njombe">Njombe</option>
                    <option value="pwani">Pwani</option>
                    <option value="rukwa">Rukwa</option>
                    <option value="ruvuma">Ruvuma</option>
                    <option value="shinyanga">Shinyanga</option>
                    <option value="simiyu">Simiyu</option>
                    <option value="singida">Singida</option>
                    <option value="songwe">Songwe</option>
                    <option value="tabora">Tabora</option>
                    <option value="tanga">Tanga</option>
                    <option value="unguja-north">Unguja North</option>
                    <option value="unguja-south">Unguja South</option>
                    <option value="urban-west">Urban West</option>
                    <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-bold text-white mb-2 text-center">
                  Ward
                </label>
                <select 
                  className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                  disabled={!(stagedRegion || selectedRegion)}
                  value={stagedWard || selectedWard}
                  onChange={(e) => {
                    if (e.target.value === 'other') {
                      setShowWardPopup(true);
                      setStagedWard('');
                      setSelectedWard('');
                    } else {
                      setStagedWard(e.target.value);
                      setStagedCustomWard('');
                      setSelectedWard(e.target.value);
                      setCustomWard('');
                    }
                  }}
                  required
                >
                  <option value="" className="text-gray-400">---</option>
                    {selectedRegion && wardsByRegion[selectedRegion as keyof typeof wardsByRegion]?.map((ward) => (
                      <option key={ward} value={ward.toLowerCase().replace(/\s+/g, '-')}>
                        {ward}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="text-center mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">
              Pricing & Terms
            </h2>
          </div>

          {/* Pricing Card */}
          <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-[22.5rem] xl:max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-base font-bold text-white mb-2 text-center">
                  Price/month (Tsh)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                  placeholder="---"
                  value={(stagedFormData || formData).price}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d]/g, '');
                    if (value) {
                      value = parseInt(value).toLocaleString();
                    }
                    handleInputChange('price', value);
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-base font-bold text-white mb-2 text-center">
                  Payment Plan
                </label>
                <select 
                  className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                  value={(stagedFormData || formData).paymentPlan}
                  onChange={(e) => handleInputChange('paymentPlan', e.target.value)}
                  required
                >
                  <option value="" className="text-gray-400">---</option>
                  <option value="3+">3+ Months</option>
                  <option value="6+">6+ Months</option>
                  <option value="12+">12+ Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Ownership Section */}
          <div className="text-center mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">
              Property ownership
            </h2>
          </div>

          {/* Property Ownership Card */}
          <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-[22.5rem] xl:max-w-sm mx-auto">
            <div>
              <label className="block text-base font-bold text-white mb-2 text-center">
                Ownership Type
              </label>
              <select 
                className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                value={(stagedFormData || formData).uploaderType || ''}
                onChange={(e) => handleInputChange('uploaderType', e.target.value)}
                required
              >
                <option value="" className="text-gray-400">---</option>
                <option value="Owner">I own this property (Owner)</option>
                <option value="Broker">I do not own this property (Broker)</option>
              </select>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="mt-4 max-w-[22.5rem] xl:max-w-sm mx-auto mb-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <button 
                  type="submit"
                  disabled={!hasChanges()}
                  className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:cursor-not-allowed h-12" 
                  style={{ backgroundColor: 'rgb(34, 197, 94)' }}
                >
                  <span className="text-base">Save Changes</span>
                </button>
              </div>
              <div className="flex-1">
                <button 
                  type="button"
                  onClick={() => {
                    if (onCancel) {
                      onCancel();
                    }
                    onClose();
                  }}
                  className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12" 
                  style={{ backgroundColor: 'rgb(239, 68, 68)' }}
                >
                  <span className="text-base">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Custom Ward Popup */}
      {showWardPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            touchAction: 'none', 
            minHeight: '100vh', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="rounded-xl p-4 w-full mx-4 shadow-2xl overflow-hidden bg-white" 
            style={{ 
              maxWidth: '21.6rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add Custom Ward</h3>
              <p className="text-gray-600 mt-2">Enter the name of your ward in {selectedRegion.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center h-10 bg-white text-gray-800 placeholder-gray-400"
                placeholder="Enter ward name"
                value={customWard}
                onChange={(e) => setCustomWard(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                onClick={() => {
                  setShowWardPopup(false);
                  setCustomWard('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors"
                onClick={() => {
                  if (customWard.trim()) {
                    // Add the custom ward to the region's ward list
                    const regionKey = selectedRegion as keyof typeof wardsByRegion;
                    if (regionKey && wardsByRegion[regionKey]) {
                      // Create a new ward list with the custom ward added
                      const updatedWards = [...wardsByRegion[regionKey].filter(ward => ward !== 'Other'), customWard.trim(), 'Other'];
                      wardsByRegion[regionKey] = updatedWards;
                      
                      // Stage and set the selected ward to the custom ward
                      const wardValue = customWard.trim().toLowerCase().replace(/\s+/g, '-');
                      setStagedCustomWard(customWard.trim());
                      setStagedWard(wardValue);
                      setSelectedWard(wardValue);
                      setCustomWard('');
                      setShowWardPopup(false);
                    }
                  }
                }}
                disabled={!customWard.trim()}
              >
                Add Ward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Image Popup */}
      {showMainImagePopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }} onClick={(e) => e.stopPropagation()}>
          <div className="rounded-xl p-4 w-full mx-4 shadow-2xl overflow-hidden" style={{ backgroundColor: '#0071c2', maxWidth: '24rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white">Main image</h3>
            </div>
            {tempMainImage && (
              <div className="mb-4">
                <img src={tempMainImage} alt="Main image preview" className="w-full h-32 object-cover rounded border" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" id="main-image-upload-edit" />
              <button
                type="button"
                className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black"
                style={{ backgroundColor: 'white' }}
                onClick={() => document.getElementById('main-image-upload-edit')?.click()}
              >
                <Image size={20} />
                <span className="text-base whitespace-nowrap">{tempMainImage ? 'Change image' : 'Add image'} ({tempMainImage ? '1' : '0'})</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                  onClick={() => {
                    if (tempMainImage) {
                      setTempMainImage('');
                    } else {
                      setShowMainImagePopup(false);
                    }
                  }}
                >
                  {tempMainImage ? 'Remove' : 'Cancel'}
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  onClick={handleMainImagePopupOk}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Images Popup */}
      {showOtherImagesPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }} onClick={(e) => e.stopPropagation()}>
          <div className="rounded-xl w-full mx-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ backgroundColor: '#0071c2', maxWidth: '24rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="text-center p-4 pb-2 flex-shrink-0">
              <h3 className="text-xl font-bold text-white">Other images</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4">
              {tempAdditionalImages.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-col gap-2">
                    {tempAdditionalImages.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <img src={image} alt={`Additional ${index + 1}`} className="w-3/4 h-32 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => removeTempAdditionalImage(index)}
                          onDragStart={(e) => e.preventDefault()}
                          onMouseDown={(e) => { if (e.detail > 1) { e.preventDefault(); } }}
                          className="flex-1 px-4 py-2 text-white rounded-lg font-medium self-center text-2xl select-none outline-none focus:outline-none"
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', WebkitTouchCallout: 'none', WebkitTapHighlightColor: 'transparent', outline: 'none', touchAction: 'manipulation' }}
                        >
                          <span style={{ transform: 'scaleX(1.3)', display: 'inline-block', userSelect: 'none' }}>−</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 p-4 pt-2 flex-shrink-0">
              <input type="file" multiple accept="image/*" onChange={handleAdditionalImagesUpload} className="hidden" id="additional-images-upload-edit" />
              <button
                type="button"
                className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black"
                style={{ backgroundColor: 'white' }}
                onClick={() => document.getElementById('additional-images-upload-edit')?.click()}
              >
                <Image size={20} />
                <span className="text-base whitespace-nowrap">{tempAdditionalImages.length > 0 ? 'Add more images' : 'Add images'} ({tempAdditionalImages.length})</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                  onClick={() => {
                    if (tempAdditionalImages.length > 0) {
                      removeAllTempAdditionalImages();
                    } else {
                      setShowOtherImagesPopup(false);
                    }
                  }}
                >
                  {tempAdditionalImages.length > 0 ? 'Remove all' : 'Cancel'}
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  onClick={handleOtherImagesPopupOk}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && onDelete && property && (
        <DeleteConfirmPopup
          onConfirm={() => {
            if (onDelete && property) {
              onDelete(property.id);
              setShowDeleteConfirm(false);
              onClose();
            }
          }}
          onCancel={() => {
            setShowDeleteConfirm(false);
          }}
        />
      )}

    </div>
  );
}
