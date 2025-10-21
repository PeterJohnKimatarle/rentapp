// Simple script to create basic placeholder images
const fs = require('fs');
const path = require('path');

// Create simple SVG-based placeholder images
const createPlaceholderImage = (filename, title) => {
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f3f4f6"/>
  <rect x="50" y="50" width="700" height="500" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
  <text x="400" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">${title}</text>
  <text x="400" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af">Property Image</text>
  <text x="400" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">800x600</text>
</svg>`;

  const filePath = path.join(__dirname, '..', 'public', 'images', 'properties', filename);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created: ${filename}`);
};

console.log('🏠 Creating simple placeholder images...\n');

// Create 16 simple house images
const images = [
  { file: 'house-1.jpg', title: 'Modern Apartment' },
  { file: 'house-2.jpg', title: 'Ocean View' },
  { file: 'house-3.jpg', title: 'Cozy House' },
  { file: 'house-4.jpg', title: 'Garden View' },
  { file: 'house-5.jpg', title: 'Luxury Villa' },
  { file: 'house-6.jpg', title: 'Beach Access' },
  { file: 'house-7.jpg', title: 'Private Pool' },
  { file: 'house-8.jpg', title: 'Studio' },
  { file: 'house-9.jpg', title: 'Furnished' },
  { file: 'house-10.jpg', title: 'Family Home' },
  { file: 'house-11.jpg', title: 'Backyard' },
  { file: 'house-12.jpg', title: 'Penthouse' },
  { file: 'house-13.jpg', title: 'City View' },
  { file: 'house-14.jpg', title: 'Ocean View' },
  { file: 'house-15.jpg', title: 'Executive House' },
  { file: 'house-16.jpg', title: 'Gated Community' }
];

images.forEach(img => {
  createPlaceholderImage(img.file, img.title);
});

console.log('\n🎉 Simple images created!');
console.log('📋 Summary:');
console.log('- 7 properties total');
console.log('- 2-3 images per property');
console.log('- 16 total images');
console.log('- Simple SVG placeholders');
console.log('\n💡 To replace with real images:');
console.log('1. Take photos of your properties');
console.log('2. Save them as house-1.jpg, house-2.jpg, etc.');
console.log('3. Replace the files in public/images/properties/');
console.log('4. Keep the same filenames!');
