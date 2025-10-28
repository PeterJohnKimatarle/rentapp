"use client";

import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Image } from 'lucide-react';

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
  createdAt: string;
}

export default function ListPropertyPage() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [customWard, setCustomWard] = useState('');
  const [showWardPopup, setShowWardPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
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
    additionalImages: [] as string[]
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
          console.log('Property saved after removing old properties');
          return true; // Success after cleanup
        } catch (quotaError) {
          console.error('Still failed after removing old properties:', quotaError);
          setErrorMessage('Sorry, it seems we are having a technical issue. Please contact support@rentapp.co.tz or Call/Whatsapp on 0755-123-500 for further assistance.');
          setShowError(true);
          return false; // Failure
        }
      } else {
        // For other errors, just show the error without modifying existing data
        console.error('Non-quota error occurred:', error);
        setErrorMessage('Sorry, it seems we are having a technical issue. Please contact support@rentapp.co.tz or Call/Whatsapp on 0755-123-500 for further assistance.');
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
        setFormData(prev => ({ ...prev, mainImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
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
        setFormData(prev => ({ ...prev, additionalImages: [...prev.additionalImages, ...base64Images] }));
      });
    }
  };

  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, mainImage: '' }));
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      additionalImages: prev.additionalImages.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create property object
    const property: Property = {
      id: Date.now().toString(),
      ...formData,
      images: [formData.mainImage, ...formData.additionalImages].filter(img => img), // Combine main and additional images
      region: selectedRegion,
      ward: selectedWard || customWard,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const saveSuccess = saveProperty(property);
    
    if (!saveSuccess) {
      setIsSubmitting(false);
      return; // Stop execution if save failed
    }

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyAdded', { detail: property }));

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
        additionalImages: []
      });
      setSelectedRegion('');
      setSelectedWard('');
      setCustomWard('');
      setShowSuccess(false);
      
      // Redirect to homepage to see the new property
      router.push('/');
    }, 2000);
  };

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showWardPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWardPopup]);
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
                     <option value="studio">Studio</option>
                     <option value="house">House</option>
                     <option value="villa">Villa</option>
                     <option value="commercial">Commercial Space</option>
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
                       // Open file picker
                       document.getElementById('main-image-upload')?.click();
                     }}
                     className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black" 
                     style={{ backgroundColor: 'white' }}
                   >
                     <Image size={20} />
                     <span className="text-base whitespace-nowrap">Main image ({formData.mainImage ? '1' : '0'})</span>
                   </button>
               </label>
               
               {/* Main Image Preview */}
               {formData.mainImage && (
                 <div className="mt-2">
                   <div className="text-xs text-gray-600 mb-1">Main Image:</div>
                   <div className="relative">
                     <img 
                       src={formData.mainImage} 
                       alt="Main" 
                       className="w-full h-20 object-cover rounded border"
                     />
                     <button
                       type="button"
                       onClick={removeMainImage}
                       className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                     >
                       ×
                     </button>
                   </div>
                 </div>
               )}
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
                       // Open file picker
                       document.getElementById('additional-images-upload')?.click();
                     }}
                     className="w-full text-black px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12 border-2 border-black" 
                     style={{ backgroundColor: 'white' }}
                   >
                     <Image size={20} />
                     <span className="text-base whitespace-nowrap">Other images ({formData.additionalImages.length})</span>
                   </button>
               </label>
               
               {/* Additional Images Preview */}
               {formData.additionalImages.length > 0 && (
                 <div className="mt-2">
                   <div className="text-xs text-gray-600 mb-1">Other Images:</div>
                   <div className="grid grid-cols-4 gap-1">
                     {formData.additionalImages.map((image, index) => (
                       <div key={index} className="relative">
                         <img 
                           src={image} 
                           alt={`Additional ${index + 1}`} 
                           className="w-full h-12 object-cover rounded border"
                         />
                         <button
                           type="button"
                           onClick={() => removeAdditionalImage(index)}
                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs"
                         >
                           ×
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>

         {/* Submit and Cancel Buttons */}
         <div className="mt-4 max-w-sm mx-auto">
           <div className="flex gap-2">
             <div className="flex-1">
               <button 
                 type="submit"
                 disabled={isSubmitting}
                 className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-12" 
                 style={{ backgroundColor: 'rgb(34, 197, 94)' }}
               >
                 <span className="text-base">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
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
                     additionalImages: []
                   });
                   setSelectedRegion('');
                   setSelectedWard('');
                   setCustomWard('');
                   // Redirect to homepage
                   router.push('/');
                 }}
                 className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors h-12" 
                 style={{ backgroundColor: 'rgb(239, 68, 68)' }}
               >
                 <span className="text-base">Cancel</span>
               </button>
             </div>
           </div>
         </div>

         {/* Success Message */}
         {showSuccess && (
           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-green-500 text-white p-6 rounded-lg text-center">
               <h3 className="text-xl font-bold mb-2">Property Listed Successfully!</h3>
               <p>Your property has been added to Rentapp.</p>
             </div>
           </div>
         )}

         {/* Custom Error Modal */}
         {showError && (
           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                   Sorry, it seems we are having a technical issue. Please contact{' '}
                   <a 
                     href="mailto:support@rentapp.co.tz" 
                     className="text-blue-600 hover:text-blue-800 underline font-medium"
                   >
                     support@rentapp.co.tz
                   </a>
                   {' '}or Call/WA on{' '}
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
                   Got it
                 </button>
               </div>
             </div>
           </div>
         )}
        </form>

          {/* Custom Ward Popup */}
          {showWardPopup && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="rounded-xl p-4 w-full mx-4 shadow-2xl transform scale-105 overflow-hidden" 
                style={{ backgroundColor: '#0071c2', maxWidth: '21.6rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white">Add Custom Ward</h3>
                  <p className="text-white mt-2">Enter the name of your ward in {selectedRegion.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
                
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100"
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
        </Layout>
      );
    }
