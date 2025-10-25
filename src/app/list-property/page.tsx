"use client";

import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';

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

export default function ListPropertyPage() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [customWard, setCustomWard] = useState('');
  const [showWardPopup, setShowWardPopup] = useState(false);

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
        <div className="w-full max-w-md mx-auto px-1 sm:px-2 lg:px-4">
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
                   <select className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100">
                     <option value="" className="text-gray-400">---</option>
                     <option value="1">1 Bdrm apartment</option>
                     <option value="2">2 Bdrm apartment</option>
                     <option value="3">3 Bdrm apartment</option>
                     <option value="4">4 Bdrm apartment</option>
                     <option value="5">5 Bdrm apartment</option>
                   </select>
                 </div>
                 <div className="col-span-2">
                   <label className="block text-base font-bold text-white mb-2 text-center">
                     Status
                   </label>
                   <select className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100">
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
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      let value = target.value.replace(/[^\d]/g, '');
                      if (value) {
                        value = parseInt(value).toLocaleString();
                      }
                      target.value = value;
                    }}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-white mb-2 text-center">
                    Payment Plan
                  </label>
                  <select className="w-full px-3 py-2  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center h-10 bg-gray-100">
                    <option value="" className="text-gray-400">---</option>
                    <option value="3+">3+ Months</option>
                    <option value="6+">6+ Months</option>
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
            <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 mb-2 max-w-sm mx-auto">
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
             <p className="text-gray-500 mb-2">Upload property images</p>
             <p className="text-sm text-gray-400">Drag and drop images here or click to browse</p>
           </div>
         </div>

         {/* Submit Button */}
         <div className="flex justify-center">
           <button
             type="submit"
             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
           >
             List Property
           </button>
            </div>
          </div>

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
