import { Category } from '../categories/entities/category.entity';
import * as fs from 'fs';
import * as path from 'path';

// JSON dosyasını oku
const categoriesJsonPath = path.join(__dirname, '../../public/categories.json');

export const categoriesSeed: Partial<Category>[] = [];

try {
  const fileContent = fs.readFileSync(categoriesJsonPath, 'utf8');
  
  // JSON'ı temizle - boş satırları ve gereksiz virgülleri kaldır
  const cleanedContent = fileContent
    .replace(/,\s*}/g, '}')  // Obje sonundaki gereksiz virgülleri kaldır
    .replace(/,\s*]/g, ']')  // Array sonundaki gereksiz virgülleri kaldır
    .replace(/^\s*[\r\n]/gm, ''); // Boş satırları kaldır
  
  const categoriesData = JSON.parse(cleanedContent);

  // Ana kategorileri ekle
  categoriesData.forEach((category: any) => {
    const categoryEntity: Partial<Category> & { originalId?: string } = {
      originalId: category.id, // Store original ID for mapping
      name: category.name,
      description: category.description || '',
      icon: category.iconUrl || '',
      orderIndex: category.displayOrder || 0,
      parentId: null, // Main categories have no parent
      isActive: true,
    };
    
    categoriesSeed.push(categoryEntity);
  });
  
  // Alt kategorileri ekle (parentId'yi daha sonra güncelleyeceğiz)
  categoriesData.forEach((category: any) => {
    if (category.subCategories && category.subCategories.length > 0) {
      category.subCategories.forEach((subCategory: any) => {
        const subCategoryEntity: Partial<Category> & { originalId?: string; parentOriginalId?: string } = {
          originalId: subCategory.id, // Store original ID for mapping
          parentOriginalId: category.id, // Store parent's original ID
          name: subCategory.name,
          description: subCategory.description || '',
          icon: subCategory.iconUrl || '',
          orderIndex: subCategory.displayOrder || 0,
          parentId: null, // Will be updated after parent is saved
          isActive: true,
        };
        
        categoriesSeed.push(subCategoryEntity);
      });
    }
  });
  
  console.log(`✅ ${categoriesSeed.length} kategori yüklendi`);
} catch (error) {
  console.error('❌ JSON dosyası okuma hatası:', error.message);
  // Hata durumunda boş array döndür
}