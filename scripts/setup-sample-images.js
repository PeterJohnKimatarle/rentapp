// Script to help set up sample images for development
// Run this with: node scripts/setup-sample-images.js

const fs = require('fs');
const path = require('path');

// Sample image URLs that are more reliable
const sampleImages = {
  'property-4-image-1.jpg': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
  'property-4-image-2.jpg': 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop&q=80',
  'property-4-image-3.jpg': 'https://images.unsplash.com/photo-1521782462922-9318be1d0af0?w=800&h=600&fit=crop&q=80',
  
  'property-5-image-1.jpg': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=80',
  'property-5-image-2.jpg': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80',
  'property-5-image-3.jpg': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
  
  'property-6-image-1.jpg': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&q=80',
  'property-6-image-2.jpg': 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&q=80',
  'property-6-image-3.jpg': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop&q=80',
  
  'property-7-image-1.jpg': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
  'property-7-image-2.jpg': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80',
  'property-7-image-3.jpg': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&q=80',
  
  'property-8-image-1.jpg': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=80',
  'property-8-image-2.jpg': 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop&q=80',
  'property-8-image-3.jpg': 'https://images.unsplash.com/photo-1521782462922-9318be1d0af0?w=800&h=600&fit=crop&q=80',
  
  'property-9-image-1.jpg': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80',
  'property-9-image-2.jpg': 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&q=80',
  'property-9-image-3.jpg': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop&q=80',
  
  'property-10-image-1.jpg': 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop&q=80',
  'property-10-image-2.jpg': 'https://images.unsplash.com/photo-1521782462922-9318be1d0af0?w=800&h=600&fit=crop&q=80',
  'property-10-image-3.jpg': 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=800&h=600&fit=crop&q=80',
  
  'property-11-image-1.jpg': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80',
  'property-11-image-2.jpg': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=80',
  'property-11-image-3.jpg': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&q=80'
};

console.log('📸 Setting up sample images for local hosting...');
console.log('📁 Images will be saved to: public/images/properties/');
console.log('');

// Create the directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'properties');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create placeholder files for now
Object.keys(sampleImages).forEach(filename => {
  const filePath = path.join(imagesDir, filename);
  const placeholderContent = `# Placeholder for ${filename}
# Replace this file with your actual property image
# Recommended size: 800x600 pixels
# Format: JPG, PNG, or WebP
# File size: Under 500KB for best performance

# To add your own image:
# 1. Take photos of your properties
# 2. Resize them to 800x600 pixels
# 3. Save as JPG files
# 4. Replace this file with your actual image
# 5. Keep the same filename: ${filename}
`;

  fs.writeFileSync(filePath, placeholderContent);
  console.log(`✅ Created placeholder: ${filename}`);
});

console.log('');
console.log('🎉 Setup complete!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Replace the placeholder files with your actual property images');
console.log('2. Keep the same filenames (property-X-image-Y.jpg)');
console.log('3. Use 800x600 pixel images for best results');
console.log('4. Keep file sizes under 500KB for fast loading');
console.log('');
console.log('💡 Benefits of local images:');
console.log('✅ Never break - hosted on your own server');
console.log('✅ Fast loading - no external dependencies');
console.log('✅ Full control - you own the images');
console.log('✅ Reliable - no rate limiting or outages');
console.log('✅ SEO friendly - better for search engines');
