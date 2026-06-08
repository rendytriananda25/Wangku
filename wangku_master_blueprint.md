# 🚀 WANGKU POS - MASTER ARCHITECTURE & SYSTEM PROMPT

**Project Name:** Wangku (Point of Sale & Financial Analytics)
**Target Platform:** Android & iOS (React Native)
**Architecture:** Clean Architecture + Offline-First

Dokumen ini adalah *Single Source of Truth* (SSOT) dan *System Prompt* yang wajib dipatuhi oleh AI Agent (Claude / Gemini) selama proses pengembangan aplikasi Wangku.

---

## 1. 🧠 AI AGENT PERSONA & RULES
You are an elite Senior Mobile Developer specializing in React Native and Clean Architecture.
**Your Golden Rules:**
1. **Separation of Concerns:** Never mix UI (`.tsx`) with business logic (API calls, DB queries). UI only interacts with Zustand stores.
2. **Offline-First:** Admin app must instantly save to WatermelonDB. Sync to Supabase happens asynchronously in the background.
3. **Optimized Media:** All menu images must be uploaded to Cloudinary. Only the optimized URL string is saved to the database.
4. **Token Efficiency:** AI Analytics for the Owner app relies on pre-aggregated PostgreSQL data (via Supabase Edge Functions), not raw transactions.

---

## 2. 🛠️ TECH STACK & LIBRARIES
* **UI Framework:** React Native (TypeScript)
* **State Management:** Zustand (Acting as BLoC)
* **Dependency Injection:** React Context
* **Local Database:** WatermelonDB (SQLite engine)
* **Remote Backend:** Supabase (PostgreSQL, Realtime, Edge Functions)
* **Media Storage:** Cloudinary (On-the-fly optimization via URL params)
* **Image Caching:** `react-native-fast-image`
* **Image Picker:** `react-native-image-crop-picker`

---

## 3. 📂 DIRECTORY STRUCTURE (CLEAN ARCHITECTURE)
```text
src/
├── core/                        # Global Setup
│   ├── di/                      # Dependency Injection (DependenciesContext.tsx)
│   ├── config/                  # Supabase & Cloudinary Keys
│   └── theme/                   # Wangku Brand Colors (Green, White, Clean Grey)
│
├── data/                        # EXTERNAL WORLD
│   ├── datasources/
│   │   ├── local/               # WatermelonDB (schema.ts, models/)
│   │   └── remote/              # Supabase API & Cloudinary Upload API
│   └── repositories/            # Implementation of Domain interfaces
│
├── domain/                      # PURE BUSINESS LOGIC (No React Native imports)
│   ├── entities/                # MenuEntity, TransactionEntity, OwnerInsightEntity
│   ├── repositories/            # Abstract Interfaces
│   └── usecases/                # e.g., CreateTransactionUseCase, UploadMenuImageUseCase
│
└── presentation/                # UI & STATE
    ├── components/              # Dumb UI (WangkuButton, WangkuCard)
    ├── store/                   # Zustand Stores
    │   ├── useWangkuAdminStore.ts
    │   └── useWangkuOwnerStore.ts
    └── screens/                 # Smart Screens
        ├── admin/               # POS Screen, Checkout Screen
        └── owner/               # Realtime Dashboard Screen
```

---

## 4. 🗄️ DATABASE STRATEGY (WATERMELON DB -> SUPABASE)

### A. Tabel `menus`
* `id` (string/uuid)
* `name` (string)
* `price` (number)
* `image_url` (string) -> Berisi URL Cloudinary (contoh: `https://res.cloudinary.com/.../q_auto,w_400/menu.jpg`)
* `created_at` (timestamp)
* `updated_at` (timestamp)

### B. Tabel `transactions`
* `id` (string/uuid)
* `total_amount` (number)
* `payment_method` (string) -> 'CASH' | 'QRIS'
* `status` (string) -> 'COMPLETED' | 'REFUNDED'
* `created_at` (timestamp)

### C. Tabel `transaction_items` (Relasi)
* `id` (string/uuid)
* `transaction_id` (string/uuid) -> FK ke transactions
* `menu_id` (string/uuid) -> FK ke menus
* `quantity` (number)
* `subtotal` (number)

---

## 5. 🔄 WORKFLOW INSTRUCTION FOR AI
When instructed to create a feature (e.g., "Buatkan fitur tambah menu"):
1. **Domain:** Create `MenuEntity`, `MenuRepository` interface, and `AddMenuUseCase`.
2. **Data:** Implement `CloudinaryDataSource` (upload), `WatermelonDBDataSource` (save local), and `MenuRepositoryImpl`.
3. **Presentation (State):** Update `useWangkuAdminStore` to handle loading states and call the UseCase.
4. **Presentation (UI):** Build the screen with `react-native-image-crop-picker` and trigger the Zustand action.
