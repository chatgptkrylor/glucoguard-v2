# GlucoGuard AI v2 - Demo Script
## Dr. Nadeem Rais Partnership Presentation
### Tuesday, March 24, 2026 - 10:00 AM

---

## Opening (2 minutes)

**Introduction:**
"Good morning Dr. Rais. Thank you for taking the time to see GlucoGuard AI. This is a comprehensive diabetes management system designed specifically for the Indian market, incorporating the clinical insights from your Pandora document."

**Problem Statement:**
"Diabetes management in India faces unique challenges - diverse dietary habits across regions, limited access to endocrinologists, and the need for personalized care at scale. GlucoGuard addresses these challenges through AI-powered monitoring and meal planning."

---

## Demo Flow (8 minutes)

### 1. Dashboard Overview (2 minutes)

**Navigate to Dashboard**

**Key Points:**
- "The dashboard provides a comprehensive view of the patient's glucose trends"
- "AI-powered risk assessment based on multiple factors"
- "Integration of glucose readings, meal timing, sleep, stress, and exercise"

**Show:**
- Glucose chart with readings (FBG 140, PPBG 200)
- HbA1c estimate (8.2%)
- Time-in-range statistics
- AI Risk Scores (Hypo: 73%, Hyper: 45%)
- 7-day trend visualization

**Clinical Context:**
"These risk scores are calculated using the 50+ glucose disruptors from your Pandora research - including sleep quality, stress levels, medication adherence, and the dawn phenomenon."

---

### 2. AI Meal Planner (3 minutes)

**Navigate to Meal Planner**

**Key Points:**
- "Personalized meal recommendations based on current glucose levels"
- "100+ Indian foods database with glycemic index data"
- "Region-specific options (North, South, East, West Indian cuisine)"
- "Glycemic load calculations for each meal"

**Demonstration:**
1. Show current glucose input (140 mg/dL)
2. Select "Lunch" meal type
3. Select "Any Region" or specific region
4. Show 6 meal recommendations with:
   - Glycemic load (low/medium/high)
   - Predicted glucose change
   - Calorie and macronutrient breakdown

**Example Meal:**
"Here's a South Indian lunch option - Idli with Sambar. The system calculates:
- Glycemic Load: Medium
- Predicted glucose change: +35 mg/dL
- Total calories: 250
- High in fiber and protein"

**Clinical Value:**
"This helps patients make informed food choices based on their current glucose levels and regional dietary preferences."

**Show Daily Plan:**
- Click "Show Full Day Plan"
- Display complete day's meals with total carb count
- Emphasize the 24-hour glucose management approach

---

### 3. Predictive Alerts (2 minutes)

**Navigate to Alerts Panel**

**Key Points:**
- "AI-powered prediction of hypoglycemia and hyperglycemia"
- "Pattern detection from glucose history"
- "Real-time risk assessment with confidence scores"

**Demonstration:**
1. Show Hypoglycemia Risk card
   - Risk level: Medium/High
   - Confidence: 75%
   - Predicted time: Next 2 hours

2. Show Hyperglycemia Risk card
   - Risk level: Low/Medium
   - Trend: Rising slowly

3. Show Pattern Detection
   - Post-meal spike pattern identified
   - Evening glucose trend
   - Dawn phenomenon detection

**Active Alerts:**
- Show alert: "Hypoglycemia Risk Detected"
- Recommended action: "Consider having a snack with 15-20g carbs"
- Show acknowledgment mechanism

**Clinical Context:**
"These predictions use trend analysis from the patient's glucose history, time since last meal, and the clinical factors you identified - food timing, sleep quality, medication adherence, physical activity, and stress levels."

---

### 4. Indian Food Database (1 minute)

**Navigate to Food Database**

**Key Points:**
- "Comprehensive database of 100+ Indian foods"
- "Glycemic index and glycemic load data"
- "Searchable by name (English and Hindi)"
- "Filterable by region, category, and GI level"

**Demonstration:**
1. Show the database stats (Low GI: 60, Medium: 30, High: 10)
2. Search for "roti" or "dal"
3. Show food details:
   - Hindi name (रोटी)
   - Region (North Indian)
   - Category (Grain)
   - Glycemic index (62)
   - Nutrition info (calories, carbs, protein, fat)

4. Show filtering by:
   - Region (North/South/East/West)
   - Category (Grains, Pulses, Vegetables)
   - GI Level (Low/Medium/High)

**Clinical Value:**
"This empowers patients to understand the glycemic impact of their traditional foods, making culturally appropriate dietary choices."

---

## Closing (2 minutes)

**Summary:**
"GlucoGuard AI provides:
1. Real-time glucose monitoring with AI-powered risk assessment
2. Personalized meal planning for Indian cuisine
3. Predictive alerts for hypo/hyperglycemia
4. Comprehensive food database with glycemic data

**Partnership Opportunity:**
"We're seeking a clinical partnership to pilot this with 50-100 patients in your practice. Your expertise and the clinical insights from your Pandora research would be invaluable for refining the AI models."

**Next Steps:**
"If you're interested, we can:
1. Set up a pilot program with your patients
2. Integrate with CGM devices and hospital systems
3. Develop additional features based on your clinical feedback"

**Q&A:**
"What questions do you have about the system or the partnership?"

---

## Technical Details (if asked)

**Architecture:**
- Frontend: Vue.js 3 with Composition API
- Backend: TypeScript (no external AI APIs - all algorithms run locally)
- Database: 100 Indian foods with GI/GL data
- Offline capable: Works without internet

**Clinical Algorithms:**
- HbA1c estimation: (Average Glucose + 46.7) / 28.7
- Hypo/hyper prediction: Trend analysis + clinical factors
- Glycemic load calculation: (GI × carbs) / 100
- Pattern detection: Statistical analysis of glucose history

**Data Privacy:**
- All patient data stored locally
- No cloud dependencies for core functionality
- HIPAA-compliant architecture

---

## Demo Preparation Checklist

- [ ] Test all views load correctly
- [ ] Verify glucose charts render
- [ ] Check meal recommendations generate
- [ ] Confirm alerts display properly
- [ ] Test food database search/filter
- [ ] Prepare backup device/tablet
- [ ] Have GitHub repo link ready
- [ ] Print technical architecture diagram (optional)

---

## Contact Information

**Nancy Almeida**
- Email: [your-email]
- GitHub: https://github.com/chatgptkrylor/glucoguard-v2

**Demo URL:** [To be deployed]

---

*Demo Duration: 10 minutes*
*Q&A: 5-10 minutes*
*Total Meeting Time: 20 minutes*
