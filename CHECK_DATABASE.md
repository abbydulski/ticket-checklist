# Database Setup Check

## ⚠️ IMPORTANT: The freeze is likely because you haven't run the SQL scripts yet!

The reassignment feature requires new database columns that don't exist yet.

---

## 🔍 Quick Diagnosis

### **Symptom:** App freezes when clicking reassign button

### **Cause:** Missing database columns

The app is trying to update columns (`assigned_to_user_id`, `assigned_to_email`) that don't exist in your database yet.

---

## ✅ Solution: Run the SQL Scripts

### **Step 1: Add Assignment Columns**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy and paste this:

```sql
-- Add assignment columns to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID REFERENCES auth.users(id);

ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS assigned_to_email TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to_user_id 
ON tickets(assigned_to_user_id);
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see: **Success. No rows returned**

---

### **Step 2: Update RLS Policies**

1. In **SQL Editor**, click **New Query**
2. Copy and paste the entire contents of `supabase-update-policies-all-users.sql`
3. Click **Run**
4. You should see: **Success. No rows returned**

---

## 🧪 Verify It Worked

### **Check Columns Exist:**

Run this query in Supabase SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tickets' 
ORDER BY ordinal_position;
```

You should see:
- `assigned_to_user_id` (uuid)
- `assigned_to_email` (text)

### **Check Policies Exist:**

Run this query:

```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'tickets';
```

You should see:
- `All users can view all tickets`
- `All users can create tickets`
- `All users can update all tickets`
- `All users can delete all tickets`

---

## 🚀 After Running Scripts

1. **Refresh your browser** (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
2. **Try clicking reassign again**
3. **Check browser console** (F12) for any errors
4. **It should work!** 🎉

---

## 🐛 Still Freezing?

If it still freezes after running the scripts:

1. **Open browser console** (F12 → Console tab)
2. **Click the reassign button**
3. **Look for error messages** (they'll be in red)
4. **Share the error message** so I can help debug

The console logs I added will show:
- "Loading users..."
- "Users result: ..."
- "Opening reassign modal for ticket: ..."
- "Available users: ..."

---

## 📝 Quick Reference

**Files to run in Supabase:**
1. `supabase-add-assignment-columns.sql` ← Run this FIRST
2. `supabase-update-policies-all-users.sql` ← Run this SECOND

**Where to run them:**
- Supabase Dashboard → SQL Editor → New Query → Paste → Run

**Expected result:**
- "Success. No rows returned" for both scripts

---

## ✨ Once It's Working

You'll be able to:
- ✅ Click reassign button without freezing
- ✅ See dropdown with all users (including yourself as "Me")
- ✅ Assign tickets to anyone
- ✅ See "Assigned: email" on ticket cards
- ✅ Delete any ticket (not just your own)

---

**Run those SQL scripts and you'll be good to go!** 🚀

