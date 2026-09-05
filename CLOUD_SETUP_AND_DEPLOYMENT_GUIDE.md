# 🚀 Tiruchengode Municipal CivicConnect Portal
## Turnkey Cloud Storage & Live Web Publishing Guide

This guide shows you how to connect **Free Cloud Storage (Supabase)** so complaints and photos sync live across all mobile phones and laptops, and how to **Publish the Website** to Netlify or Vercel in 2 minutes.

---

## ⚡ Part 1: Set Up Free Cloud Storage in 2 Minutes (Supabase)

Supabase gives you **free PostgreSQL database + free media storage bucket (for Before/After photos)** with no credit card required.

### Step 1: Create a Free Project
1. Go to [https://supabase.com](https://supabase.com) and click **"Start your project"**.
2. Sign in with GitHub or your Google account.
3. Click **"New Project"**.
   - **Name**: `CivicConnect Portal`
   - **Database Password**: Set any secure password (e.g. `Civic@2026Secure`)
   - **Region**: Select `South Asia (Mumbai)` or the region closest to you.
   - Click **"Create new project"**.

---

### Step 2: Run the 1-Click Database & Storage Bucket Script
In your Supabase Dashboard:
1. Click on **"SQL Editor"** (left sidebar icon `>_`).
2. Click **"New query"** and paste the SQL script below:

```sql
-- 1. Create Complaints Table with Geo & Photo columns
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  ward TEXT NOT NULL,
  category TEXT NOT NULL,
  problem TEXT NOT NULL,
  address TEXT NOT NULL,
  lat NUMERIC DEFAULT 11.3800,
  lng NUMERIC DEFAULT 77.8946,
  citizen_name TEXT NOT NULL,
  citizen_mobile TEXT NOT NULL,
  before_photos JSONB DEFAULT '[]'::jsonb,
  before_photo TEXT,
  after_photos JSONB DEFAULT '[]'::jsonb,
  after_photo TEXT,
  status TEXT NOT NULL DEFAULT 'Registered',
  worker_notes TEXT DEFAULT '',
  admin_message TEXT DEFAULT '',
  admin_message_time TEXT DEFAULT '',
  rejection_reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 2. Create Workers Table
CREATE TABLE IF NOT EXISTS workers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  ward TEXT NOT NULL,
  mobile TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed Default Field Workers
INSERT INTO workers (name, username, password, ward, mobile)
VALUES 
  ('Ramesh Kumar', 'worker1', 'pass123', 'Ward 1', '9876543210'),
  ('Suresh Singh', 'worker2', 'pass123', 'Ward 3', '9123456789')
ON CONFLICT (username) DO NOTHING;

-- 4. Enable Row Level Security (RLS) & Allow Public Read/Write
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write complaints" 
ON complaints FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write workers" 
ON workers FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Real-Time Sync on Complaints
ALTER PUBLICATION supabase_realtime ADD TABLE complaints;

-- 6. Create Public Storage Bucket for Before & After Inspection Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('complaints-media', 'complaints-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read complaints-media" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert complaints-media" ON storage.objects;
DROP POLICY IF EXISTS "Public Update complaints-media" ON storage.objects;

CREATE POLICY "Public Read complaints-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'complaints-media');

CREATE POLICY "Public Insert complaints-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'complaints-media');

CREATE POLICY "Public Update complaints-media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'complaints-media')
WITH CHECK (bucket_id = 'complaints-media');
```

3. Click **"Run"** (green button). You will see `Success. No rows returned`. Your cloud database and image storage bucket are now ready!

---

### Step 3: Get Your API Keys
1. In your Supabase Dashboard, click **Project Settings** (gear icon at the bottom of the left sidebar).
2. Click **API**.
3. Copy these two values:
   - **Project URL**: e.g., `https://xyzcompany.supabase.co`
   - **anon / public key**: e.g., `eyJhbGciOiJIUzI1NiIsIn...`

---

### Step 4: Paste Keys into Your CivicConnect Portal
1. Open your CivicConnect website.
2. In the top header bar, click the **"☁️ Cloud Storage"** badge (or open **Admin Portal > Cloud Storage Settings**).
3. Paste your **Supabase URL** and **Anon Key**.
4. Click **"⚡ Test Cloud Connection"** — you will see `🟢 Connected to Supabase Cloud & Media Bucket!`.
5. Click **"💾 Save & Sync Local Data to Cloud"**.

Now, all complaints, Before/After photos, and worker updates will automatically save to the cloud in real time!

---

## 🌐 Part 2: Publish Your Website Online (Free)

Since this portal is a lightweight, high-performance web application, you can publish it in 60 seconds.

### Method A: Netlify Drop (Easiest — No Git required!)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the folder containing your website:
   `c:\Users\naren\OneDrive\ANTIGRAVITY\Complaint Portal`
3. Netlify will deploy it instantly and give you a live URL like `https://tiruchengode-civicconnect.netlify.app`!
4. Open the website on your phone, open Cloud Settings, and enter your Supabase credentials once.

### Method B: Vercel (Instant Deploy)
1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **"Add New Project"** > Import from your GitHub repo, OR in your terminal run:
   ```bash
   npx vercel
   ```
3. Accept the defaults. Vercel will deploy and output your production URL.

### Method C: GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 📱 Cross-Device Verification Checklist
Once published with Supabase Cloud Storage:
1. **Public Phone**: Citizen opens website, clicks **"Detect My Live GPS Location"**, snaps a photo, and submits.
2. **Worker Phone**: Worker logs in as `worker1` / `pass123`. The complaint appears immediately with the live photo and GPS marker. Worker uploads the AFTER photo.
3. **Admin Laptop**: Admin logs in via OTP or `Tiruchengode@2026`. Admin inspects Before vs After photo proofs and clicks **"Approve & Verify Closed"**.
4. All status updates update in real time across every device!
