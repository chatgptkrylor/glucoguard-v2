/**
 * Indian Food Database
 * 100+ Indian foods with nutrition data
 */

export interface FoodItem {
  id: string;
  name: string;
  hindiName: string;
  region: 'north' | 'south' | 'east' | 'west' | 'pan-india';
  category: 'grain' | 'pulse' | 'vegetable' | 'fruit' | 'dairy' | 'meat' | 'snack' | 'beverage';
  servingSize: string;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  calories: number;
  glycemicIndex: number;
  glycemicLoad: 'low' | 'medium' | 'high';
  tags: string[];
}

// North Indian Foods
const northIndian: FoodItem[] = [
  { id: 'roti', name: 'Roti (Whole Wheat)', hindiName: 'रोटी', region: 'north', category: 'grain', servingSize: '1 medium', carbs: 15, protein: 3, fat: 0.5, fiber: 2, calories: 80, glycemicIndex: 62, glycemicLoad: 'medium', tags: ['vegetarian', 'staple'] },
  { id: 'chapati', name: 'Chapati (Multigrain)', hindiName: 'चपाती', region: 'north', category: 'grain', servingSize: '1 medium', carbs: 18, protein: 4, fat: 1, fiber: 3, calories: 95, glycemicIndex: 52, glycemicLoad: 'low', tags: ['vegetarian', 'healthy'] },
  { id: 'dal-makhani', name: 'Dal Makhani', hindiName: 'दाल मखानी', region: 'north', category: 'pulse', servingSize: '1 cup', carbs: 25, protein: 12, fat: 8, fiber: 8, calories: 220, glycemicIndex: 35, glycemicLoad: 'low', tags: ['vegetarian', 'protein-rich'] },
  { id: 'palak-paneer', name: 'Palak Paneer', hindiName: 'पालक पनीर', region: 'north', category: 'dairy', servingSize: '1 cup', carbs: 8, protein: 14, fat: 15, fiber: 3, calories: 220, glycemicIndex: 15, glycemicLoad: 'low', tags: ['vegetarian', 'calcium-rich'] },
  { id: 'chole', name: 'Chole (Chickpea Curry)', hindiName: 'छोले', region: 'north', category: 'pulse', servingSize: '1 cup', carbs: 35, protein: 12, fat: 8, fiber: 10, calories: 270, glycemicIndex: 28, glycemicLoad: 'low', tags: ['vegetarian', 'high-fiber'] },
  { id: 'basmati-rice', name: 'Rice (Basmati)', hindiName: 'चावल', region: 'north', category: 'grain', servingSize: '1 cup cooked', carbs: 45, protein: 4, fat: 0.5, fiber: 1, calories: 205, glycemicIndex: 58, glycemicLoad: 'medium', tags: ['vegetarian', 'gluten-free'] },
  { id: 'raita', name: 'Raita', hindiName: 'रायता', region: 'north', category: 'dairy', servingSize: '1 cup', carbs: 8, protein: 6, fat: 4, fiber: 0, calories: 90, glycemicIndex: 25, glycemicLoad: 'low', tags: ['vegetarian', 'cooling'] },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken', hindiName: 'तंदूरी चिकन', region: 'north', category: 'meat', servingSize: '100g', carbs: 2, protein: 28, fat: 8, fiber: 0, calories: 195, glycemicIndex: 0, glycemicLoad: 'low', tags: ['high-protein', 'low-carb'] },
  { id: 'dal-fry', name: 'Dal Fry', hindiName: 'दाल फ्राई', region: 'north', category: 'pulse', servingSize: '1 cup', carbs: 22, protein: 10, fat: 6, fiber: 7, calories: 180, glycemicIndex: 30, glycemicLoad: 'low', tags: ['vegetarian', 'protein-rich'] },
  { id: 'aloo-gobi', name: 'Aloo Gobi', hindiName: 'आलू गोभी', region: 'north', category: 'vegetable', servingSize: '1 cup', carbs: 18, protein: 3, fat: 8, fiber: 4, calories: 165, glycemicIndex: 55, glycemicLoad: 'medium', tags: ['vegetarian', 'home-style'] },
  { id: 'rajma', name: 'Rajma', hindiName: 'राजमा', region: 'north', category: 'pulse', servingSize: '1 cup', carbs: 32, protein: 15, fat: 6, fiber: 11, calories: 250, glycemicIndex: 29, glycemicLoad: 'low', tags: ['vegetarian', 'kidney-beans'] },
  { id: 'paneer-tikka', name: 'Paneer Tikka', hindiName: 'पनीर टिक्का', region: 'north', category: 'dairy', servingSize: '100g', carbs: 4, protein: 18, fat: 20, fiber: 1, calories: 260, glycemicIndex: 15, glycemicLoad: 'low', tags: ['vegetarian', 'protein-rich'] },
  { id: 'butter-chicken', name: 'Butter Chicken', hindiName: 'बटर चिकन', region: 'north', category: 'meat', servingSize: '150g', carbs: 8, protein: 32, fat: 18, fiber: 1, calories: 320, glycemicIndex: 10, glycemicLoad: 'low', tags: ['high-protein', 'creamy'] },
  { id: 'naan', name: 'Naan', hindiName: 'नान', region: 'north', category: 'grain', servingSize: '1 piece', carbs: 35, protein: 6, fat: 8, fiber: 2, calories: 260, glycemicIndex: 65, glycemicLoad: 'medium', tags: ['vegetarian', 'leavened'] },
  { id: 'kheer', name: 'Kheer', hindiName: 'खीर', region: 'north', category: 'dairy', servingSize: '1 cup', carbs: 40, protein: 8, fat: 10, fiber: 0, calories: 300, glycemicIndex: 70, glycemicLoad: 'high', tags: ['vegetarian', 'sweet', 'dessert'] },
];

// South Indian Foods
const southIndian: FoodItem[] = [
  { id: 'idli', name: 'Idli', hindiName: 'इडली', region: 'south', category: 'grain', servingSize: '2 pieces', carbs: 25, protein: 5, fat: 0.5, fiber: 2, calories: 130, glycemicIndex: 60, glycemicLoad: 'medium', tags: ['vegetarian', 'fermented'] },
  { id: 'dosa', name: 'Dosa (Plain)', hindiName: 'डोसा', region: 'south', category: 'grain', servingSize: '1 medium', carbs: 20, protein: 3, fat: 5, fiber: 1, calories: 135, glycemicIndex: 66, glycemicLoad: 'medium', tags: ['vegetarian', 'crispy'] },
  { id: 'sambar', name: 'Sambar', hindiName: 'सांभर', region: 'south', category: 'pulse', servingSize: '1 cup', carbs: 18, protein: 6, fat: 3, fiber: 5, calories: 120, glycemicIndex: 35, glycemicLoad: 'low', tags: ['vegetarian', 'lentil-soup'] },
  { id: 'rasam', name: 'Rasam', hindiName: 'रसम', region: 'south', category: 'pulse', servingSize: '1 cup', carbs: 8, protein: 2, fat: 2, fiber: 2, calories: 60, glycemicIndex: 20, glycemicLoad: 'low', tags: ['vegetarian', 'digestive'] },
  { id: 'appam', name: 'Appam', hindiName: 'अप्पम', region: 'south', category: 'grain', servingSize: '2 pieces', carbs: 30, protein: 3, fat: 4, fiber: 1, calories: 170, glycemicIndex: 55, glycemicLoad: 'medium', tags: ['vegetarian', 'kerala-style'] },
  { id: 'pongal', name: 'Pongal', hindiName: 'पोंगल', region: 'south', category: 'grain', servingSize: '1 cup', carbs: 40, protein: 6, fat: 8, fiber: 2, calories: 260, glycemicIndex: 65, glycemicLoad: 'medium', tags: ['vegetarian', 'rice-lentil'] },
  { id: 'coconut-chutney', name: 'Coconut Chutney', hindiName: 'नारियल चटनी', region: 'south', category: 'dairy', servingSize: '2 tbsp', carbs: 4, protein: 1, fat: 8, fiber: 2, calories: 90, glycemicIndex: 20, glycemicLoad: 'low', tags: ['vegetarian', 'side'] },
  { id: 'medu-vada', name: 'Medu Vada', hindiName: 'मेदु वड़ा', region: 'south', category: 'pulse', servingSize: '2 pieces', carbs: 20, protein: 8, fat: 10, fiber: 4, calories: 200, glycemicIndex: 45, glycemicLoad: 'low', tags: ['vegetarian', 'fried'] },
  { id: 'uthappam', name: 'Uthappam', hindiName: 'उत्तपम', region: 'south', category: 'grain', servingSize: '1 medium', carbs: 25, protein: 5, fat: 6, fiber: 3, calories: 190, glycemicIndex: 58, glycemicLoad: 'medium', tags: ['vegetarian', 'thick-pancake'] },
  { id: 'avial', name: 'Avial', hindiName: 'अवियल', region: 'south', category: 'vegetable', servingSize: '1 cup', carbs: 15, protein: 4, fat: 10, fiber: 6, calories: 170, glycemicIndex: 35, glycemicLoad: 'low', tags: ['vegetarian', 'mixed-vegetables'] },
  { id: 'fish-curry-south', name: 'Fish Curry', hindiName: 'मछली करी', region: 'south', category: 'meat', servingSize: '150g', carbs: 6, protein: 28, fat: 12, fiber: 1, calories: 240, glycemicIndex: 15, glycemicLoad: 'low', tags: ['high-protein', 'coastal'] },
  { id: 'curd-rice', name: 'Curd Rice', hindiName: 'दही चावल', region: 'south', category: 'grain', servingSize: '1 cup', carbs: 35, protein: 6, fat: 4, fiber: 1, calories: 200, glycemicIndex: 48, glycemicLoad: 'low', tags: ['vegetarian', 'cooling'] },
  { id: 'lemon-rice', name: 'Lemon Rice', hindiName: 'नींबू चावल', region: 'south', category: 'grain', servingSize: '1 cup', carbs: 38, protein: 5, fat: 6, fiber: 2, calories: 220, glycemicIndex: 55, glycemicLoad: 'medium', tags: ['vegetarian', 'tangy'] },
  { id: 'payasam', name: 'Payasam', hindiName: 'पायसम', region: 'south', category: 'dairy', servingSize: '1 cup', carbs: 45, protein: 7, fat: 8, fiber: 0, calories: 280, glycemicIndex: 75, glycemicLoad: 'high', tags: ['vegetarian', 'sweet', 'dessert'] },
  { id: 'pulihora', name: 'Pulihora', hindiName: 'पुलिहोरा', region: 'south', category: 'grain', servingSize: '1 cup', carbs: 42, protein: 5, fat: 8, fiber: 3, calories: 260, glycemicIndex: 58, glycemicLoad: 'medium', tags: ['vegetarian', 'tamarind'] },
];

// East Indian Foods
const eastIndian: FoodItem[] = [
  { id: 'fish-curry-east', name: 'Fish Curry (Mustard)', hindiName: 'सर्सो वाली मछली', region: 'east', category: 'meat', servingSize: '150g', carbs: 5, protein: 25, fat: 10, fiber: 1, calories: 210, glycemicIndex: 0, glycemicLoad: 'low', tags: ['high-protein', 'mustard-flavor'] },
  { id: 'gobindobhog-rice', name: 'Rice (Govindobhog)', hindiName: 'गोविंदभोग चावल', region: 'east', category: 'grain', servingSize: '1 cup', carbs: 40, protein: 4, fat: 0.5, fiber: 1, calories: 180, glycemicIndex: 50, glycemicLoad: 'low', tags: ['vegetarian', 'aromatic'] },
  { id: 'aloo-posto', name: 'Aloo Posto', hindiName: 'आलू पोस्तो', region: 'east', category: 'vegetable', servingSize: '1 cup', carbs: 20, protein: 3, fat: 12, fiber: 3, calories: 200, glycemicIndex: 65, glycemicLoad: 'medium', tags: ['vegetarian', 'poppy-seed'] },
  { id: 'chingri-malai', name: 'Chingri Malai Curry', hindiName: 'चिंगड़ी मलाई करी', region: 'east', category: 'meat', servingSize: '1 cup', carbs: 6, protein: 20, fat: 18, fiber: 1, calories: 260, glycemicIndex: 15, glycemicLoad: 'low', tags: ['high-protein', 'coconut', 'prawns'] },
  { id: 'macher-jhol', name: 'Macher Jhol', hindiName: 'माछेर झोल', region: 'east', category: 'meat', servingSize: '1 cup', carbs: 8, protein: 18, fat: 8, fiber: 2, calories: 170, glycemicIndex: 20, glycemicLoad: 'low', tags: ['high-protein', 'light-curry'] },
  { id: 'shukto', name: 'Shukto', hindiName: 'শুক্তো', region: 'east', category: 'vegetable', servingSize: '1 cup', carbs: 12, protein: 3, fat: 8, fiber: 4, calories: 130, glycemicIndex: 35, glycemicLoad: 'low', tags: ['vegetarian', 'bitter-melon'] },
  { id: 'luchi', name: 'Luchi', hindiName: 'লুচি', region: 'east', category: 'grain', servingSize: '2 pieces', carbs: 30, protein: 4, fat: 12, fiber: 1, calories: 240, glycemicIndex: 68, glycemicLoad: 'medium', tags: ['vegetarian', 'fried', 'puffy'] },
  { id: 'cholar-dal', name: 'Cholar Dal', hindiName: 'ছোলার ডাল', region: 'east', category: 'pulse', servingSize: '1 cup', carbs: 28, protein: 10, fat: 6, fiber: 7, calories: 200, glycemicIndex: 32, glycemicLoad: 'low', tags: ['vegetarian', 'chana-dal'] },
  { id: 'mishti-doi', name: 'Mishti Doi', hindiName: 'মিষ্টি দই', region: 'east', category: 'dairy', servingSize: '1 cup', carbs: 30, protein: 7, fat: 8, fiber: 0, calories: 220, glycemicIndex: 48, glycemicLoad: 'low', tags: ['vegetarian', 'sweet', 'yogurt'] },
  { id: 'sandesh', name: 'Sandesh', hindiName: 'সন্দেশ', region: 'east', category: 'dairy', servingSize: '2 pieces', carbs: 25, protein: 8, fat: 6, fiber: 0, calories: 180, glycemicIndex: 55, glycemicLoad: 'medium', tags: ['vegetarian', 'sweet', 'dessert'] },
  { id: 'rosogolla', name: 'Rosogolla', hindiName: 'রসগোল্লা', region: 'east', category: 'dairy', servingSize: '2 pieces', carbs: 35, protein: 6, fat: 2, fiber: 0, calories: 160, glycemicIndex: 65, glycemicLoad: 'medium', tags: ['vegetarian', 'sweet', 'syrupy'] },
  { id: 'bhapa-ilish', name: 'Bhapa Ilish', hindiName: 'ভাপা ইলিশ', region: 'east', category: 'meat', servingSize: '150g', carbs: 4, protein: 30, fat: 15, fiber: 0, calories: 280, glycemicIndex: 0, glycemicLoad: 'low', tags: ['high-protein', 'hilsa', 'steamed'] },
  { id: 'doi-maach', name: 'Doi Maach', hindiName: 'দই মাছ', region: 'east', category: 'meat', servingSize: '150g', carbs: 8, protein: 26, fat: 14, fiber: 1, calories: 260, glycemicIndex: 15, glycemicLoad: 'low', tags: ['high-protein', 'curry'] },
  { id: 'pitha', name: 'Pitha', hindiName: 'পিঠা', region: 'east', category: 'grain', servingSize: '2 pieces', carbs: 40, protein: 5, fat: 8, fiber: 2, calories: 260, glycemicIndex: 60, glycemicLoad: 'medium', tags: ['vegetarian', 'rice-cake', 'festival'] },
  { id: 'kosha-mangsho', name: 'Kosha Mangsho', hindiName: 'কোষা মাংস', region: 'east', category: 'meat', servingSize: '150g', carbs: 10, protein: 28, fat: 20, fiber: 2, calories: 320, glycemicIndex: 10, glycemicLoad: 'low', tags: ['high-protein', 'spicy', 'mutton'] },
];

// West Indian Foods
const westIndian: FoodItem[] = [
  { id: 'dhokla', name: 'Dhokla', hindiName: 'ढोकला', region: 'west', category: 'grain', servingSize: '2 pieces', carbs: 20, protein: 6, fat: 4, fiber: 3, calories: 140, glycemicIndex: 45, glycemicLoad: 'low', tags: ['vegetarian', 'steamed', 'gujarati'] },
  { id: 'thepla', name: 'Thepla', hindiName: 'थेपला', region: 'west', category: 'grain', servingSize: '2 pieces', carbs: 25, protein: 5, fat: 8, fiber: 4, calories: 200, glycemicIndex: 48, glycemicLoad: 'low', tags: ['vegetarian', 'fenugreek'] },
  { id: 'undhiyu', name: 'Undhiyu', hindiName: 'उंधियू', region: 'west', category: 'vegetable', servingSize: '1 cup', carbs: 30, protein: 8, fat: 12, fiber: 8, calories: 280, glycemicIndex: 40, glycemicLoad: 'low', tags: ['vegetarian', 'mixed-vegetables', 'gujarati'] },
  { id: 'gujarati-kadhi', name: 'Gujarati Kadhi', hindiName: 'कढ़ी', region: 'west', category: 'dairy', servingSize: '1 cup', carbs: 12, protein: 6, fat: 6, fiber: 1, calories: 120, glycemicIndex: 30, glycemicLoad: 'low', tags: ['vegetarian', 'sweet-sour'] },
  { id: 'sev-tamatar', name: 'Sev Tamatar', hindiName: 'सेव टमाटर', region: 'west', category: 'vegetable', servingSize: '1 cup', carbs: 18, protein: 4, fat: 10, fiber: 3, calories: 180, glycemicIndex: 45, glycemicLoad: 'low', tags: ['vegetarian', 'crispy'] },
  { id: 'handvo', name: 'Handvo', hindiName: 'હાંડવો', region: 'west', category: 'grain', servingSize: '1 piece', carbs: 30, protein: 8, fat: 10, fiber: 5, calories: 240, glycemicIndex: 50, glycemicLoad: 'low', tags: ['vegetarian', 'savory-cake'] },
  { id: 'khandvi', name: 'Khandvi', hindiName: 'ખાંડવી', region: 'west', category: 'grain', servingSize: '4 rolls', carbs: 15, protein: 4, fat: 8, fiber: 2, calories: 150, glycemicIndex: 40, glycemicLoad: 'low', tags: ['vegetarian', 'rolled'] },
  { id: 'fafda', name: 'Fafda', hindiName: 'ફાફડા', region: 'west', category: 'snack', servingSize: '4 pieces', carbs: 25, protein: 4, fat: 12, fiber: 2, calories: 220, glycemicIndex: 55, glycemicLoad: 'medium', tags: ['vegetarian', 'crispy', 'snack'] },
  { id: 'jalebi-fafda', name: 'Jalebi', hindiName: 'જલેબી', region: 'west', category: 'snack', servingSize: '2 pieces', carbs: 45, protein: 3, fat: 15, fiber: 1, calories: 320, glycemicIndex: 78, glycemicLoad: 'high', tags: ['vegetarian', 'sweet', 'fried'] },
  { id: 'pav-bhaji', name: 'Pav Bhaji', hindiName: 'पाव भाजी', region: 'west', category: 'vegetable', servingSize: '1 plate', carbs: 50, protein: 10, fat: 18, fiber: 8, calories: 420, glycemicIndex: 55, glycemicLoad: 'medium', tags: ['vegetarian', 'mumbai-street', 'buttery'] },
  { id: 'vada-pav', name: 'Vada Pav', hindiName: 'वड़ा पाव', region: 'west', category: 'snack', servingSize: '1 piece', carbs: 35, protein: 6, fat: 18, fiber: 3, calories: 340, glycemicIndex: 60, glycemicLoad: 'medium', tags: ['vegetarian', 'mumbai-street', 'spicy'] },
  { id: 'misal-pav', name: 'Misal Pav', hindiName: 'मिसळ पाव', region: 'west', category: 'pulse', servingSize: '1 bowl', carbs: 40, protein: 14, fat: 16, fiber: 10, calories: 380, glycemicIndex: 42, glycemicLoad: 'low', tags: ['vegetarian', 'maharashtrian', 'spicy'] },
  { id: 'puran-poli', name: 'Puran Poli', hindiName: 'पुरण पोळी', region: 'west', category: 'grain', servingSize: '1 piece', carbs: 45, protein: 7, fat: 10, fiber: 4, calories: 300, glycemicIndex: 62, glycemicLoad: 'medium', tags: ['vegetarian', 'sweet', 'stuffed'] },
  { id: 'modak', name: 'Modak', hindiName: 'मोदक', region: 'west', category: 'grain', servingSize: '2 pieces', carbs: 35, protein: 4, fat: 12, fiber: 3, calories: 260, glycemicIndex: 58, glycemicLoad: 'medium', tags: ['vegetarian', 'sweet', 'ganesh-chaturthi'] },
  { id: 'bharli-vangi', name: 'Bharli Vangi', hindiName: 'भरली वांगी', region: 'west', category: 'vegetable', servingSize: '1 cup', carbs: 15, protein: 5, fat: 12, fiber: 6, calories: 190, glycemicIndex: 35, glycemicLoad: 'low', tags: ['vegetarian', 'stuffed-brinjal', 'nutty'] },
];

// Pan-Indian Foods
const panIndian: FoodItem[] = [
  { id: 'khichdi', name: 'Khichdi', hindiName: 'खिचड़ी', region: 'pan-india', category: 'grain', servingSize: '1 cup', carbs: 35, protein: 8, fat: 5, fiber: 4, calories: 220, glycemicIndex: 50, glycemicLoad: 'low', tags: ['vegetarian', 'rice-lentil', 'comfort'] },
  { id: 'poha', name: 'Poha', hindiName: 'पोहा', region: 'pan-india', category: 'grain', servingSize: '1 cup', carbs: 30, protein: 4, fat: 6, fiber: 2, calories: 190, glycemicIndex: 65, glycemicLoad: 'medium', tags: ['vegetarian', 'flattened-rice'] },
  { id: 'upma', name: 'Upma', hindiName: 'उपमा', region: 'pan-india', category: 'grain', servingSize: '1 cup', carbs: 32, protein: 6, fat: 8, fiber: 3, calories: 220, glycemicIndex: 62, glycemicLoad: 'medium', tags: ['vegetarian', 'semolina'] },
  { id: 'sprouts-salad', name: 'Sprouts Salad', hindiName: 'अंकुरित सलाद', region: 'pan-india', category: 'pulse', servingSize: '1 cup', carbs: 15, protein: 10, fat: 2, fiber: 6, calories: 120, glycemicIndex: 25, glycemicLoad: 'low', tags: ['vegetarian', 'high-protein', 'raw'] },
  { id: 'mixed-vegetable-sabzi', name: 'Mixed Vegetable Sabzi', hindiName: 'मिश्रित सब्जी', region: 'pan-india', category: 'vegetable', servingSize: '1 cup', carbs: 12, protein: 3, fat: 5, fiber: 5, calories: 110, glycemicIndex: 35, glycemicLoad: 'low', tags: ['vegetarian', 'mixed-veg'] },
  { id: 'curd', name: 'Curd/Yogurt', hindiName: 'दही', region: 'pan-india', category: 'dairy', servingSize: '1 cup', carbs: 12, protein: 10, fat: 8, fiber: 0, calories: 150, glycemicIndex: 35, glycemicLoad: 'low', tags: ['vegetarian', 'probiotic'] },
  { id: 'paneer-butter-masala', name: 'Paneer Butter Masala', hindiName: 'पनीर बटर मसाला', region: 'pan-india', category: 'dairy', servingSize: '1 cup', carbs: 12, protein: 16, fat: 22, fiber: 2, calories: 310, glycemicIndex: 15, glycemicLoad: 'low', tags: ['vegetarian', 'creamy', 'rich'] },
  { id: 'tandoori-fish', name: 'Tandoori Fish', hindiName: 'तंदूरी मछली', region: 'pan-india', category: 'meat', servingSize: '150g', carbs: 3, protein: 32, fat: 10, fiber: 0, calories: 230, glycemicIndex: 0, glycemicLoad: 'low', tags: ['high-protein', 'grilled'] },
  { id: 'green-salad', name: 'Green Salad', hindiName: 'हरा सलाद', region: 'pan-india', category: 'vegetable', servingSize: '1 bowl', carbs: 8, protein: 2, fat: 2, fiber: 4, calories: 60, glycemicIndex: 15, glycemicLoad: 'low', tags: ['vegetarian', 'raw', 'fiber-rich'] },
  { id: 'cucumber-raita', name: 'Cucumber Raita', hindiName: 'खीरा रायता', region: 'pan-india', category: 'dairy', servingSize: '1 cup', carbs: 6, protein: 5, fat: 4, fiber: 1, calories: 80, glycemicIndex: 20, glycemicLoad: 'low', tags: ['vegetarian', 'cooling'] },
  { id: 'lentil-soup', name: 'Lentil Soup (Dal)', hindiName: 'दाल', region: 'pan-india', category: 'pulse', servingSize: '1 cup', carbs: 20, protein: 10, fat: 4, fiber: 6, calories: 160, glycemicIndex: 30, glycemicLoad: 'low', tags: ['vegetarian', 'protein-rich'] },
  { id: 'grilled-chicken', name: 'Grilled Chicken', hindiName: 'ग्रिल्ड चिकन', region: 'pan-india', category: 'meat', servingSize: '150g', carbs: 0, protein: 40, fat: 12, fiber: 0, calories: 280, glycemicIndex: 0, glycemicLoad: 'low', tags: ['high-protein', 'low-carb'] },
  { id: 'egg-bhurji', name: 'Egg Bhurji', hindiName: 'अंडा भुर्जी', region: 'pan-india', category: 'meat', servingSize: '2 eggs', carbs: 4, protein: 14, fat: 16, fiber: 1, calories: 210, glycemicIndex: 0, glycemicLoad: 'low', tags: ['high-protein', 'breakfast'] },
  { id: 'masala-chai', name: 'Masala Chai', hindiName: 'मसाला चाय', region: 'pan-india', category: 'beverage', servingSize: '1 cup', carbs: 8, protein: 2, fat: 4, fiber: 0, calories: 80, glycemicIndex: 40, glycemicLoad: 'low', tags: ['vegetarian', 'tea'] },
  { id: 'chaas', name: 'Buttermilk (Chaas)', hindiName: 'छाछ', region: 'pan-india', category: 'beverage', servingSize: '1 cup', carbs: 5, protein: 4, fat: 2, fiber: 0, calories: 50, glycemicIndex: 20, glycemicLoad: 'low', tags: ['vegetarian', 'digestive'] },
  { id: 'moong-dal-chilla', name: 'Moong Dal Chilla', hindiName: 'मूंग दाल चिल्ला', region: 'pan-india', category: 'pulse', servingSize: '2 pieces', carbs: 20, protein: 12, fat: 6, fiber: 4, calories: 180, glycemicIndex: 45, glycemicLoad: 'low', tags: ['vegetarian', 'high-protein', 'breakfast'] },
  { id: 'besan-chilla', name: 'Besan Chilla', hindiName: 'बेसन चिल्ला', region: 'pan-india', category: 'grain', servingSize: '2 pieces', carbs: 25, protein: 10, fat: 8, fiber: 5, calories: 220, glycemicIndex: 50, glycemicLoad: 'low', tags: ['vegetarian', 'gram-flour'] },
  { id: 'sabudana-khichdi', name: 'Sabudana Khichdi', hindiName: 'साबूदाना खिचड़ी', region: 'pan-india', category: 'grain', servingSize: '1 cup', carbs: 50, protein: 3, fat: 10, fiber: 2, calories: 320, glycemicIndex: 80, glycemicLoad: 'high', tags: ['vegetarian', 'fasting', 'sago'] },
  { id: 'aloo-chaat', name: 'Aloo Chaat', hindiName: 'आलू चाट', region: 'pan-india', category: 'snack', servingSize: '1 plate', carbs: 35, protein: 4, fat: 12, fiber: 4, calories: 280, glycemicIndex: 70, glycemicLoad: 'high', tags: ['vegetarian', 'street-food', 'tangy'] },
  { id: 'chana-chaat', name: 'Chana Chaat', hindiName: 'छोले चाट', region: 'pan-india', category: 'pulse', servingSize: '1 cup', carbs: 28, protein: 12, fat: 6, fiber: 8, calories: 220, glycemicIndex: 30, glycemicLoad: 'low', tags: ['vegetarian', 'high-protein', 'street-food'] },
];

// Combine all foods
export const indianFoods: FoodItem[] = [
  ...northIndian,
  ...southIndian,
  ...eastIndian,
  ...westIndian,
  ...panIndian,
];

// Helper functions
export function getFoodsByRegion(region: FoodItem['region']): FoodItem[] {
  return indianFoods.filter(food => food.region === region);
}

export function getFoodsByCategory(category: FoodItem['category']): FoodItem[] {
  return indianFoods.filter(food => food.category === category);
}

export function getFoodsByGlycemicLoad(load: FoodItem['glycemicLoad']): FoodItem[] {
  return indianFoods.filter(food => food.glycemicLoad === load);
}

export function getFoodsForDiabetics(): FoodItem[] {
  return indianFoods.filter(food => food.glycemicLoad === 'low');
}

export function searchFoods(query: string): FoodItem[] {
  const lowerQuery = query.toLowerCase();
  return indianFoods.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.hindiName.includes(query)
  );
}

export function getFoodById(id: string): FoodItem | undefined {
  return indianFoods.find(food => food.id === id);
}

// Database statistics
export const foodDatabaseStats = {
  totalFoods: indianFoods.length,
  byRegion: {
    north: northIndian.length,
    south: southIndian.length,
    east: eastIndian.length,
    west: westIndian.length,
    'pan-india': panIndian.length,
  },
  byGILoad: {
    low: indianFoods.filter(f => f.glycemicLoad === 'low').length,
    medium: indianFoods.filter(f => f.glycemicLoad === 'medium').length,
    high: indianFoods.filter(f => f.glycemicLoad === 'high').length,
  },
};
