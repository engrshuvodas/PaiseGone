# BajarBros - Mess Expense Tracker 🍛

Welcome to **BajarBros**, the ultimate utility for mess-mates to track and settle daily বাজার (grocery) expenses fairly and efficiently.

## 🚀 Getting Started

### Option A: One-Click Run (Recommended for Windows)
Just double-click the **`Run_BajarBros.bat`** file in the root folder. 
It will automatically install dependencies (first time only) and start the server for you.

### Option B: Manual Terminal
1.  **Installation**: Run `npm install` in the project root.
2.  **Start App**: Run `npm start`.
3.  **Access**: Open `http://localhost:5173` in your browser.

## ✨ Key Features

### 1. The Smarter Dashboard
- **Live Summary**: See the total mess spend and exactly how much each person needs to contribute for an equal split.
- **Settlement Engine**: The app automatically identifies who is "in debt" and who is "owed money" based on their contributions.
- **Smart Suggestions**: It generates a list of exactly who should give how much to whom (e.g., *"Rahim should give ৳450 to Shuvo"*).
- **Date Filtering**: View records for specific months or custom date ranges.

### 2. Multi-Payer Bajar Entry
- Use the **Add Bajar** page to log shopping.
- Supports **Multiple Payers**: If 2 or 3 brothers split the cost of a shopping trip at the store, you can select all of them. The app will divide the credit among them equally.
- Detailed item lists and data validation.

### 3. Member Management
- Add new "brothers" to the mess or update names easily.
- Calculations update instantly when members are added or removed.

### 4. Excel Reports
- Download high-quality `.xlsx` reports from the dashboard.
- Includes total summaries and share-per-person data at the bottom.

## 💻 Technical Stack
- **UI**: Ant Design (Premium Green/Blue Theme)
- **Engine**: React Context API + Hooks
- **Logic**: Greedy Settlement Algorithm
- **Persistence**: LocalStorage (your data stays in your browser!)

---
*Created for bachelors, by BajarBros.*
