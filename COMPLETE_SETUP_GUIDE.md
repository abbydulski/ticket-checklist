# Complete Setup Guide - Ticket Ownership Features

## 🚀 New Features

1. ✅ **Password Reset** - Users can reset their password via email
2. ✅ **Ticket Ownership** - Change ticket owner to any team member
3. ✅ **All Users See All Tickets** - Team collaboration enabled
4. ✅ **All Users Visible** - See ALL registered users in dropdown (not just ticket creators)

---

## 📋 Required SQL Scripts (Run in Order)

You need to run **3 SQL scripts** in your Supabase SQL Editor.

### **Script 1: Update RLS Policies** ⭐ REQUIRED

**File:** `supabase-update-policies-all-users.sql`

**What it does:**
- Allows all users to view, update, and delete ALL tickets
- Enables team collaboration

**How to run:**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-update-policies-all-users.sql`
4. Paste and click **Run**
5. Should say: **"Success. No rows returned"**

---

### **Script 2: Add Assignment Columns** ⭐ REQUIRED

**File:** `supabase-add-assignment-columns.sql`

**What it does:**
- Adds `assigned_to_user_id` column to tickets table
- Adds `assigned_to_email` column to tickets table
- Creates index for performance

**How to run:**
1. In **SQL Editor**, click **New Query**
2. Copy the entire contents of `supabase-add-assignment-columns.sql`
3. Paste and click **Run**
4. Should say: **"Success. No rows returned"**

---

### **Script 3: Get All Users Function** ⭐ RECOMMENDED

**File:** `supabase-get-all-users-function.sql`

**What it does:**
- Creates a function to query ALL registered users from `auth.users`
- Shows ALL users in the owner dropdown (not just those who created tickets)
- **Without this:** Only users who have created tickets will appear in dropdown
- **With this:** ALL registered users appear in dropdown

**How to run:**
1. In **SQL Editor**, click **New Query**
2. Copy the entire contents of `supabase-get-all-users-function.sql`
3. Paste and click **Run**
4. Should say: **"Success. No rows returned"**

---

## 🧪 Verify Setup

### Check if columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tickets' 
ORDER BY ordinal_position;
```

You should see:
- ✅ `assigned_to_user_id` (uuid)
- ✅ `assigned_to_email` (text)

### Check if RLS policies exist:

```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'tickets';
```

You should see:
- ✅ `All users can view all tickets`
- ✅ `All users can create tickets`
- ✅ `All users can update all tickets`
- ✅ `All users can delete all tickets`

### Check if function exists:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'get_all_users';
```

You should see:
- ✅ `get_all_users`

---

## 🎯 How It Works

### **Ticket Ownership:**

1. **When created:** Creator is the initial owner
2. **When reassigned:** Assigned person becomes the owner
3. **Display logic:** Shows assigned person OR creator (if not assigned)

**Example:**
- John creates ticket → Owner: john@example.com
- John assigns to Sarah → Owner: sarah@example.com
- Sarah assigns back to John → Owner: john@example.com

### **User Dropdown:**

**Without Script 3 (get_all_users function):**
- ❌ Only shows users who have created tickets
- ❌ New users won't appear until they create a ticket

**With Script 3 (get_all_users function):**
- ✅ Shows ALL registered users
- ✅ New users appear immediately after signup
- ✅ Can assign tickets to anyone on the team

---

## 🚀 After Running Scripts

1. **Hard refresh browser** (Cmd+Shift+R or Ctrl+Shift+R)
2. **Test password reset:**
   - Click "Forgot password?" on login page
   - Enter email
   - Check inbox for reset link
   - Click link and set new password

3. **Test ticket ownership:**
   - Create a ticket
   - Hover over ticket card
   - Click **👤** (change owner) button
   - Select a user from dropdown
   - Click "Change Owner"
   - Ticket should show new owner

4. **Test all users visible:**
   - Create a new user account (signup)
   - Log back in as original user
   - Try to change owner on a ticket
   - New user should appear in dropdown ✅

---

## 🐛 Troubleshooting

### "Policy already exists" error
- ✅ This is OK! It means you already ran the script
- Just run the updated version (it drops existing policies first)

### Freeze when clicking "Change Owner"
- ❌ You haven't run Script 2 (assignment columns)
- Run `supabase-add-assignment-columns.sql`

### New users don't appear in dropdown
- ❌ You haven't run Script 3 (get_all_users function)
- Run `supabase-get-all-users-function.sql`
- App will fallback to showing only ticket creators

### "Failed to reassign ticket" error
- Check browser console (F12) for detailed error
- Make sure all 3 scripts ran successfully
- Verify columns and function exist (see "Verify Setup" above)

---

## ✨ Summary

**Minimum Required (Scripts 1 & 2):**
- ✅ Password reset works
- ✅ Ticket ownership works
- ⚠️ Only users who created tickets appear in dropdown

**Recommended (All 3 Scripts):**
- ✅ Password reset works
- ✅ Ticket ownership works
- ✅ ALL registered users appear in dropdown

---

**Run all 3 scripts for the best experience!** 🚀

