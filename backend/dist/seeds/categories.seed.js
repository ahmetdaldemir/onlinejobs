"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesSeed = void 0;
const fs = require("fs");
const path = require("path");
const categoriesJsonPath = path.join(__dirname, '../../public/categories.json');
exports.categoriesSeed = [];
try {
    const fileContent = fs.readFileSync(categoriesJsonPath, 'utf8');
    const cleanedContent = fileContent
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/^\s*[\r\n]/gm, '');
    const categoriesData = JSON.parse(cleanedContent);
    categoriesData.forEach((category) => {
        const categoryEntity = {
            originalId: category.id,
            name: category.name,
            description: category.description || '',
            icon: category.iconUrl || '',
            orderIndex: category.displayOrder || 0,
            parentId: null,
            isActive: true,
        };
        exports.categoriesSeed.push(categoryEntity);
    });
    categoriesData.forEach((category) => {
        if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach((subCategory) => {
                const subCategoryEntity = {
                    originalId: subCategory.id,
                    parentOriginalId: category.id,
                    name: subCategory.name,
                    description: subCategory.description || '',
                    icon: subCategory.iconUrl || '',
                    orderIndex: subCategory.displayOrder || 0,
                    parentId: null,
                    isActive: true,
                };
                exports.categoriesSeed.push(subCategoryEntity);
            });
        }
    });
    console.log(`✅ ${exports.categoriesSeed.length} kategori yüklendi`);
}
catch (error) {
    console.error('❌ JSON dosyası okuma hatası:', error.message);
}
//# sourceMappingURL=categories.seed.js.map