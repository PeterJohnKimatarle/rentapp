"use client";

import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Image, Info, PlusCircle } from 'lucide-react';
import { usePreventScroll } from '@/hooks/usePreventScroll';
import { useAuth } from '@/contexts/AuthContext';
import { invalidatePropertiesCache } from '@/utils/propertyUtils';

// Ward data organized by region (most common and well-known wards, alphabetically sorted)
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

// Property interface
interface Property {
  id: string;
  title?: string;
  description?: string;
  propertyType: string;
  status: string;
  region: string;
  ward: string;
  price: string;
  paymentPlan: string;
  bedrooms?: string;
  bathrooms?: string;
  squareFootage?: string;
  amenities: string[];
  images: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  uploaderType?: 'Broker' | 'Owner';
  createdAt: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
}

export default function ListPropertyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [customWard, setCustomWard] = useState('');
  const [showWardPopup, setShowWardPopup] = useState(false);
  const [showMainImagePopup, setShowMainImagePopup] = useState(false);
  const [showOtherImagesPopup, setShowOtherImagesPopup] = useState(false);
  const [tempMainImage, setTempMainImage] = useState<string>('');
  const [tempAdditionalImages, setTempAdditionalImages] = useState<string[]>([]);
  const [originalMainImage, setOriginalMainImage] = useState<string>('');
  const [originalAdditionalImages, setOriginalAdditionalImages] = useState<string[]>([]);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showRemoveAllInfo, setShowRemoveAllInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    propertyType: '',
    status: '',
    region: '',
    ward: '',
    price: '',
    paymentPlan: '',
    amenities: [] as string[],
    mainImage: '',
    additionalImages: [] as string[],
    uploaderType: '' as 'Broker' | 'Owner' | ''
  });

  // localStorage functions
  const saveProperty = (property: Property) => {
    try {
      const existingProperties = JSON.parse(localStorage.getItem('rentapp_properties') || '[]');
      
      // Check if images are too large (base64 images can be huge)
      const propertySize = JSON.stringify(property).length;
      console.log('Property size:', propertySize, 'bytes');
      
      if (propertySize > 5000000) { // 5MB limit
        console.warn('Property data is too large, removing images to save');
        // Remove images if too large
        property.images = [];
      }
      
      existingProperties.push(property);
      localStorage.setItem('rentapp_properties', JSON.stringify(existingProperties));
      invalidatePropertiesCache(); // Invalidate cache for instant updates
      console.log('Property saved successfully');
      return true; // Success
    } catch (error) {
      console.error('Failed to save property:', error);
      console.log('Error details:', (error as Error).name, (error as Error).message);
      
      // Only try to manage storage if it's actually a quota error
      if ((error as Error).name === 'QuotaExceededError') {
        console.log('Storage quota exceeded, trying to make space...');
        try {
          // Keep only the last 10 properties to make room (more conservative)
          const existingProperties = JSON.parse(localStorage.getItem('rentapp_properties') || '[]');
          const recentProperties = existingProperties.slice(-10); // Keep last 10
          recentProperties.push(property);
          localStorage.setItem('rentapp_properties', JSON.stringify(recentProperties));
          invalidatePropertiesCache(); // Invalidate cache for instant updates
          console.log('Property saved after removing old properties');
          return true; // Success after cleanup
        } catch (quotaError) {
          console.error('Still failed after removing old properties:', quotaError);
          setShowError(true);
          return false; // Failure
        }
      } else {
        // For other errors, just show the error without modifying existing data
        console.error('Non-quota error occurred:', error);
        setShowError(true);
        return false; // Failure
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempMainImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleMainImagePopupOk = () => {
    setFormData(prev => ({ ...prev, mainImage: tempMainImage }));
    setShowMainImagePopup(false);
    setTempMainImage('');
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
          // Filter out duplicates by comparing base64 strings
          const uniqueNewImages = base64Images.filter(newImage => 
            !prev.some(existingImage => existingImage === newImage)
          );
          return [...prev, ...uniqueNewImages];
        });
      });
      // Reset input value to allow selecting the same files again
      event.target.value = '';
    }
  };

  const handleOtherImagesPopupOk = () => {
    setFormData(prev => ({ ...prev, additionalImages: tempAdditionalImages }));
    setShowOtherImagesPopup(false);
    setTempAdditionalImages([]);
  };



  const removeTempAdditionalImage = (index: number) => {
    setTempAdditionalImages(prev => {
      const imageToRemove = prev[index];
      // Remove from temp
      const updatedTemp = prev.filter((_, i) => i !== index);
      // Also remove from form data by matching the base64 string
      setFormData(formPrev => ({
        ...formPrev,
        additionalImages: formPrev.additionalImages.filter(img => img !== imageToRemove)
      }));
      return updatedTemp;
    });
  };

  const removeAllTempAdditionalImages = () => {
    setTempAdditionalImages([]);
    setFormData(prev => ({ ...prev, additionalImages: [] }));
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to list a property.');
      return;
    }

    setIsSubmitting(true);

    // Create property object
    const property: Property = {
      id: Date.now().toString(),
      ...formData,
      uploaderType: (formData.uploaderType === 'Broker' || formData.uploaderType === 'Owner') ? formData.uploaderType : undefined,
      images: [formData.mainImage, ...formData.additionalImages].filter(img => img), // Combine main and additional images
      region: selectedRegion,
      ward: selectedWard || customWard,
      createdAt: new Date().toISOString(),
      ownerId: user.id,
      ownerEmail: user.email,
      ownerName: user.name
    };

    // Save to localStorage
    const saveSuccess = saveProperty(property);
    
    if (!saveSuccess) {
      setIsSubmitting(false);
      return; // Stop execution if save failed
    }

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyAdded', { detail: property }));

    // Wait 2 seconds to show submit animation
    setTimeout(() => {
      // Show success message
      setShowSuccess(true);
      setIsSubmitting(false);

      // Reset form and redirect to homepage
      setTimeout(() => {
      setFormData({
        propertyType: '',
        status: '',
        region: '',
        ward: '',
        price: '',
        paymentPlan: '',
        amenities: [],
        mainImage: '',
        additionalImages: [],
        uploaderType: ''
      });
      setSelectedRegion('');
      setSelectedWard('');
      setCustomWard('');
      setShowSuccess(false);
      
      // Go back to the previous page
      router.back();
    }, 3000);
    }, 2000); // 2 second delay to show submit animation
  };

  // Prevent body scroll when popup is open
  usePreventScroll(showWardPopup || showMainImagePopup || showOtherImagesPopup || showSuccess || showError || showDeleteAllConfirm || showRemoveAllInfo);
  return (
    <Layout>
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto px-1 sm:px-2 lg:px-4">
        {/* Header Section */}
            <div className="mt-6 mb-4 sm:mb-6 lg:mb-6 text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold text-black">
                    List Your Property
              </h1>
            </div>


         {/* Basic Information Section */}
         <div className="text-center mb-1">
           <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">
             Basic Information
           </h2>
         </div>

            {/* Basic Information Card */}
            <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-sm mx-auto">
               <div className="grid grid-cols-4 gap-2">
                 <div className="col-span-2">
                   <label className="block text-base font-bold text-white mb-2 text-center">
                     Property Type
                   </label>
                   <select 
                     className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                     value={formData.propertyType}
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
                     className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                     value={formData.status}
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
            <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-base font-bold text-white mb-2 text-center">
                    Region
                  </label>
                  <select 
                    className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
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
                    className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                    disabled={!selectedRegion}
                    value={selectedWard}
                    onChange={(e) => {
                      if (e.target.value === 'other') {
                        setShowWardPopup(true);
                        setSelectedWard('');
                      } else {
                        setSelectedWard(e.target.value);
                        setCustomWard('');
                      }
                    }}
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
            <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-base font-bold text-white mb-2 text-center">
                    Price/month (Tsh)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                    placeholder="---"
                    value={formData.price}
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
                    className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                    value={formData.paymentPlan}
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
            <div className="bg-blue-500 rounded-lg p-2 sm:p-3 mb-2 max-w-sm mx-auto">
              <div>
                <label className="block text-base font-bold text-white mb-2 text-center">
                  Ownership Type
                </label>
                  <select 
                  className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
                  value={formData.uploaderType}
                  onChange={(e) => handleInputChange('uploaderType', e.target.value)}
                  required
                >
                  <option value="" className="text-gray-400">---</option>
                  <option value="Owner">I own this property (Owner)</option>
                  <option value="Broker">I do not own this property (Broker)</option>
                </select>
              </div>
            </div>

         {/* Images Section */}
         <div className="text-center mb-2">
           <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">
             Property Images
           </h2>
         </div>

        {/* Images Card */}
        <div className="border-2 border-black rounded-lg p-2 sm:p-3 mb-2 max-w-sm mx-auto" style={{ backgroundColor: 'rgb(190, 190, 190)' }}>
           <div className="flex gap-2 justify-center">
             {/* Main Image Button */}
             <div className="flex-1">
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleMainImageUpload}
                 className="hidden"
                 id="main-image-upload"
               />
               <label htmlFor="main-image-upload" className="cursor-pointer">
                   <button 
                     type="button"
                     onClick={() => {
                       // Open popup
                       setTempMainImage(formData.mainImage); // Load current image into temp
                       setOriginalMainImage(formData.mainImage); // Store original for comparison
                       setShowMainImagePopup(true);
                     }}
                     className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black" 
                     style={{ backgroundColor: 'white' }}
                   >
                     <Image size={20} />
                     <span className="text-base whitespace-nowrap">Main image ({formData.mainImage ? '1' : '0'})</span>
                   </button>
               </label>
             </div>

             {/* Other Images Button */}
             <div className="flex-1">
               <input
                 type="file"
                 multiple
                 accept="image/*"
                 onChange={handleAdditionalImagesUpload}
                 className="hidden"
                 id="additional-images-upload"
               />
               <label htmlFor="additional-images-upload" className="cursor-pointer">
                   <button 
                     type="button"
                     onClick={() => {
                       // Open popup
                       setTempAdditionalImages([...formData.additionalImages]); // Load current images into temp
                       setOriginalAdditionalImages([...formData.additionalImages]); // Store original for comparison
                       setShowOtherImagesPopup(true);
                     }}
                     className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black" 
                     style={{ backgroundColor: 'white' }}
                   >
                     <Image size={20} />
                     <span className="text-base whitespace-nowrap">Other images ({formData.additionalImages.length})</span>
                   </button>
               </label>
             </div>
           </div>
         </div>

         {/* Submit and Cancel Buttons */}
         <div className="mt-4 mb-4 xl:mb-8 max-w-sm mx-auto">
           <div className="flex gap-2">
             <div className="flex-1">
               <button 
                 type="submit"
                 disabled={isSubmitting}
                 className={`w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 ${
                   isSubmitting ? 'cursor-wait' : ''
                 }`} 
                 style={{ backgroundColor: 'rgb(34, 197, 94)' }}
               >
                 {isSubmitting ? (
                  <span className="text-base flex items-center gap-1">
                    Posting
                    <span className="inline-flex items-center gap-0.5 translate-y-0.5">
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce"></span>
                    </span>
                  </span>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span className="text-base">Post</span>
                  </>
                )}
               </button>
             </div>
             <div className="flex-1">
               <button 
                 type="button"
                 onClick={() => {
                   // Reset form
                   setFormData({
                     propertyType: '',
                     status: '',
                     region: '',
                     ward: '',
                     price: '',
                     paymentPlan: '',
                     amenities: [],
                     mainImage: '',
                    additionalImages: [],
                    uploaderType: ''
                   });
                   setSelectedRegion('');
                   setSelectedWard('');
                   setCustomWard('');
                   // Go back to the previous page
                   router.back();
                 }}
                 className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 h-12" 
                 style={{ backgroundColor: '#ef4444' }}
               >
                 <span className="text-base">Cancel</span>
               </button>
             </div>
           </div>
         </div>

         {/* Success Message */}
         {showSuccess && (
           <div 
             className="fixed inset-0 flex items-start justify-center z-50 p-4 pt-8"
             style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
             onClick={(e) => {
               const target = e.target as HTMLElement;
               const modal = target.closest('.bg-green-500, .bg-blue-500');
               if (!modal) {
                 setShowSuccess(false);
               }
             }}
           >
             <div className="bg-green-500 text-white p-6 rounded-xl text-center max-w-sm w-full mx-4 shadow-lg">
               <h2 className="text-2xl font-bold mb-1">Congratulations</h2>
               <h3 className="text-xl font-bold">Property Listed Successfully</h3>
            </div>
           </div>
         )}

         {/* Custom Error Modal */}
         {showError && (
           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}>
             <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
               {/* Header */}
               <div className="bg-red-500 px-6 py-4 text-center">
                 <div className="flex items-center justify-center mb-2">
                   <img
                     src="/icon.png"
                     alt="Rentapp Logo"
                     className="w-12 h-12 rounded-lg mr-3"
                   />
                   <div className="text-left">
                     <h3 className="text-xl font-bold text-white leading-tight">Rentapp</h3>
                     <p className="text-red-100 text-sm leading-tight">Tanzania&apos;s #1 Renting Platform</p>
                   </div>
                 </div>
               </div>
               
               {/* Content */}
               <div className="px-6 py-6 text-center">
                 <div className="text-red-500 text-6xl mb-4">⚠️</div>
                 <h4 className="text-lg font-semibold text-gray-800 mb-3">Technical Issue</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sorry, it seems we are having a technical issue. Please Call/WA on{' '}
                   <a 
                     href="tel:+255755123500" 
                     className="text-blue-600 hover:text-blue-800 underline font-medium"
                   >
                     0755-123-500
                   </a>
                   {' '}for further assistance.
                 </p>
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                   <p className="text-blue-800 text-sm">
                     <strong>Quick Fix:</strong> Try refreshing the page or check your internet connection.
                   </p>
                 </div>
               </div>
               
               {/* Footer */}
               <div className="bg-gray-50 px-6 py-4 flex justify-center">
                 <button
                   onClick={() => setShowError(false)}
                   className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-medium transition-colors"
                 >
                   Ok, I got it
                 </button>
               </div>
             </div>
           </div>
         )}
        </form>

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
                          
                          // Set the selected ward to the custom ward
                          setSelectedWard(customWard.trim().toLowerCase().replace(/\s+/g, '-'));
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
            <div 
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ touchAction: 'none', minHeight: '100vh', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', pointerEvents: 'auto' }}
            >
              <div 
                className="rounded-xl px-4 pt-2 pb-4 w-full mx-4 shadow-2xl overflow-hidden bg-white" 
                style={{ maxWidth: '24rem', pointerEvents: 'auto' }}
                onClick={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-black">Main image</h3>
                </div>
                
                {/* Image Preview (if temp image exists) */}
                {tempMainImage && (
                  <div className="mb-4">
                    <img 
                      src={tempMainImage} 
                      alt="Main image preview" 
                      className="w-full h-48 sm:h-56 object-cover rounded border"
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
                    className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12"
                    style={{ backgroundColor: '#0071c2' }}
                    onClick={() => {
                      document.getElementById('main-image-upload-popup')?.click();
                    }}
                  >
                    <Image size={20} />
                    <span className="text-base whitespace-nowrap">{tempMainImage ? 'Change main image' : 'Add main image'} ({tempMainImage ? '1' : '0'})</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                      onClick={handleMainImagePopupOk}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 text-white rounded-lg font-medium"
                      style={{ backgroundColor: '#ef4444' }}
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

          {/* Other Images Popup */}
          {showOtherImagesPopup && (
            <div 
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ touchAction: 'none', minHeight: '100vh', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', pointerEvents: 'auto' }}
            >
              <div 
                className={`rounded-xl px-4 pt-2 pb-4 w-full mx-4 shadow-2xl overflow-hidden ${tempAdditionalImages.length > 0 ? 'flex flex-col max-h-[85vh] xl:max-h-[95vh]' : ''} bg-white`}
                style={{ maxWidth: '24rem', pointerEvents: 'auto', paddingBottom: tempAdditionalImages.length > 0 ? 'env(safe-area-inset-bottom)' : undefined }}
                onClick={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                {tempAdditionalImages.length > 0 ? (
                  <>
                {/* Header - Fixed */}
                    <div className="px-4 pt-3 flex-shrink-0 relative pb-3 -mx-4 -mt-2">
                      <div className="flex items-center justify-start relative">
                        <h3 className="text-xl font-bold text-black leading-tight">Other images</h3>
                    <button
                      type="button"
                      onClick={() => setShowRemoveAllInfo(true)}
                          className="absolute right-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                      title="How to remove all images"
                          style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                          <Info size={22} className="text-gray-700" />
                    </button>
                      </div>
                </div>
                
                {/* Images Preview - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-4 pb-2 -mx-4 min-h-0">
                      <div className="mb-0">
                      <div className="flex flex-col gap-2">
                        {tempAdditionalImages.map((image, index) => (
                          <div key={index} className="flex gap-2">
                            <img 
                              src={image} 
                              alt={`Additional ${index + 1}`} 
                                className="w-3/4 xl:w-4/5 h-44 sm:h-48 object-cover rounded border"
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
                                onMouseEnter={(e) => {
                                  // Only apply hover effect on desktop
                                  if (window.innerWidth >= 1280) {
                                    const button = e.currentTarget as HTMLButtonElement;
                                    button.style.backgroundColor = '#dc2626';
                                    const span = button.querySelector('span') as HTMLElement;
                                    if (span) {
                                      span.style.color = '#000000';
                                    }
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  // Only apply hover effect on desktop
                                  if (window.innerWidth >= 1280) {
                                    const button = e.currentTarget as HTMLButtonElement;
                                    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                                    const span = button.querySelector('span') as HTMLElement;
                                    if (span) {
                                      span.style.color = '#ffffff';
                                    }
                                  }
                                }}
                                className="flex-1 xl:flex-none xl:w-[60px] px-4 py-2 xl:px-2 xl:py-1.5 text-white rounded-lg font-medium self-center text-2xl xl:text-xl select-none outline-none focus:outline-none"
                              style={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none',
                                WebkitTouchCallout: 'none',
                                WebkitTapHighlightColor: 'transparent',
                                outline: 'none',
                                  touchAction: 'manipulation',
                                  transition: 'none'
                                }}
                                onTouchEnd={(e) => {
                                  // Ensure button resets to default state on mobile after touch
                                  if (window.innerWidth < 1280) {
                                    const button = e.currentTarget as HTMLButtonElement;
                                    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                                    const span = button.querySelector('span') as HTMLElement;
                                    if (span) {
                                      span.style.color = '#ffffff';
                                    }
                                  }
                              }}
                            >
                              <span 
                                style={{ 
                                  transform: 'scaleX(1.3)', 
                                  display: 'inline-block', 
                                    userSelect: 'none',
                                    color: '#ffffff',
                                    transition: 'none'
                                }}
                              >
                                −
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
                  </>
                ) : (
                  <>
                    {/* Header */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-black">Other images</h3>
                    </div>
                  </>
                )}
                
                {/* Buttons */}
                <div className={`flex flex-col gap-2 ${tempAdditionalImages.length > 0 ? 'p-4 pt-2 pb-3 flex-shrink-0 -mx-4' : ''}`}>
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
                    className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12"
                    style={{ backgroundColor: '#0071c2' }}
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
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 text-white rounded-lg font-medium"
                      style={{ backgroundColor: '#ef4444' }}
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

          {/* Remove All Info Popup */}
          {showRemoveAllInfo && (
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
            >
              <div 
                className="rounded-xl p-4 w-full mx-4 shadow-2xl overflow-hidden max-w-[20rem] xl:max-w-[20rem]"
                style={{ backgroundColor: '#0071c2' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-white mb-1.5 xl:hidden">Long Press Gestures</h2>
                  <h2 className="text-2xl font-bold text-white mb-1.5 hidden xl:block">Remove All Images</h2>
                  <p className="text-white/80 text-base xl:hidden"><span className="font-bold">Remove all images at once</span><br />by long pressing any image.</p>
                  <p className="text-white/80 text-base hidden xl:block"><span className="font-bold">Remove all images at once</span><br />right-click any image.</p>
                </div>
                <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowRemoveAllInfo(false)}
                    className="w-2/3 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Ok, I got it
                </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete All Confirmation Popup */}
          {showDeleteAllConfirm && (
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
            >
              <div 
                className="rounded-xl p-4 w-full mx-4 shadow-2xl overflow-hidden max-w-[20rem] xl:max-w-[20rem]"
                style={{ backgroundColor: '#0071c2' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-3">
                  <h2 className="text-2xl font-bold text-white mb-1">Remove All Images</h2>
                  <p className="text-white/80 text-base">Are you sure you want to remove all images at once ?</p>
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
        </Layout>
      );
    }












