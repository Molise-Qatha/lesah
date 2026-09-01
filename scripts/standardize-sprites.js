const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const SPRITE_DIRS = [
  'src/assets/kopanang_body',
  'src/assets/kopanang_face',
  'src/assets/kopanang_mouth_vowels',
  'src/assets/kopanang_walk'
];

const TARGET_SIZE = {
  width: 500,
  height: 500
};

const PADDING = 20; // Padding around sprite content

async function standardizeSprites() {
  console.log('🔄 Starting sprite standardization...');
  
  for (const dir of SPRITE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    
    for (const file of files) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace('.png', '_standardized.png'));
      
      try {
        const metadata = await sharp(inputPath).metadata();
        console.log(`📏 ${file}: ${metadata.width}x${metadata.height}`);
        
        // Resize to fit within target size while maintaining aspect ratio
        await sharp(inputPath)
          .resize({
            width: TARGET_SIZE.width - PADDING * 2,
            height: TARGET_SIZE.height - PADDING * 2,
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .extend({
            top: PADDING,
            bottom: PADDING,
            left: PADDING,
            right: PADDING,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toFile(outputPath);
          
        console.log(`✅ Standardized: ${file} -> ${outputPath}`);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  }
  
  console.log('✨ Sprite standardization complete!');
}

// Run the script
standardizeSprites().catch(console.error);