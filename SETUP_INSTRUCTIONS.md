# Setup Instructions for New Features

## 🚀 New Features Added

1. **Password Reset** - Users can reset their password via email
2. **Ticket Reassignment** - Any user can reassign tickets to other team members
3. **All Users See All Tickets** - Everyone can view and work on all tickets

---

## 📋 Required Database Changes

You need to run **2 SQL scripts** in your Supabase SQL Editor to enable these features.

### Step 1: Update RLS Policies

This allows all users to see and work on all tickets (not just their own).

1. Go to your **Supabase Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-update-policies-all-users.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

**What this does:**
- ✅ All users can view ALL tickets
- ✅ All users can update ALL tickets (for reassignment and progress)
- ✅ Only creators can delete their own tickets (security)

### Step 2: Add Assignment Columns

This adds the new columns needed for ticket reassignment.

1. In the **SQL Editor**, click **New Query**
2. Copy and paste the contents of `supabase-add-assignment-columns.sql`
3. Click **Run**

**What this does:**
- ✅ Adds `assigned_to_user_id` column to tickets table
- ✅ Adds `assigned_to_email` column to tickets table
- ✅ Creates an index for faster queries

---

## 🔐 Password Reset Configuration

### Supabase Email Settings

For password reset to work, you need to configure email settings in Supabase:

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Find **Reset Password** template
3. Make sure the redirect URL is set to: `{{ .SiteURL }}/reset-password`
4. (Optional) Customize the email template to match your branding

### Testing Password Reset

1. Go to the login page
2. Click **"Forgot password?"**
3. Enter your email
4. Check your email for the reset link
5. Click the link (it will take you to `/reset-password`)
6. Enter your new password
7. You'll be redirected to the dashboard

---

## 🎯 How to Use New Features

### Reassigning Tickets

1. Go to the **Dashboard**
2. Hover over any ticket card
3. Click the **👤+ (User Plus)** icon
4. Select a team member from the dropdown
5. Click **Reassign**
6. The ticket will now show "Assigned: user@email.com"

**Notes:**
- Any user can reassign any ticket
- The dropdown shows all users who have created tickets
- Assigned user is displayed in blue on the ticket card

### Viewing All Tickets

- **Before:** Users only saw their own tickets
- **After:** All users see ALL tickets on the dashboard
- Everyone can work on any ticket
- Only the creator can delete a ticket

### Deleting Tickets

- The **🗑️ (Trash)** icon only appears if you created the ticket
- This prevents accidental deletion by other team members
- Hover over a ticket to see the delete button

---

## 📱 Mobile Responsive

All new features are fully mobile-responsive:
- ✅ Reassignment modal works on mobile
- ✅ Password reset page is mobile-friendly
- ✅ Buttons stack properly on small screens

---

## 🧪 Testing Checklist

After running the SQL scripts, test these features:

### Password Reset
- [ ] Click "Forgot password?" on login page
- [ ] Enter email and submit
- [ ] Check email for reset link
- [ ] Click link and reset password
- [ ] Verify you can log in with new password

### Ticket Reassignment
- [ ] Create a ticket
- [ ] Hover over ticket and click reassign icon
- [ ] Select a user from dropdown
- [ ] Verify "Assigned: email" appears on ticket
- [ ] Have another user log in and verify they can see the ticket

### All Users See All Tickets
- [ ] Create a ticket with User A
- [ ] Log in as User B
- [ ] Verify User B can see User A's ticket
- [ ] Verify User B can work on the ticket
- [ ] Verify User B cannot delete User A's ticket

---

## 🐛 Troubleshooting

### "Failed to reassign ticket"
- Make sure you ran `supabase-add-assignment-columns.sql`
- Check that the columns exist in your tickets table

### "Failed to load tickets" or "No tickets showing"
- Make sure you ran `supabase-update-policies-all-users.sql`
- Check RLS policies in Supabase Dashboard → Authentication → Policies

### Password reset email not received
- Check Supabase Dashboard → Authentication → Email Templates
- Verify your email provider settings
- Check spam folder

### Users not appearing in reassignment dropdown
- Users only appear after they've created at least one ticket
- This is by design to avoid showing all auth.users

---

## 📝 Files Modified

### New Files
- `app/reset-password/page.tsx` - Password reset page
- `supabase-update-policies-all-users.sql` - RLS policy updates
- `supabase-add-assignment-columns.sql` - Database schema updates
- `SETUP_INSTRUCTIONS.md` - This file

### Modified Files
- `lib/auth.tsx` - Added resetPassword and updatePassword functions
- `lib/supabase.ts` - Added assigned_to_user_id and assigned_to_email to Ticket interface
- `lib/ticketService.ts` - Added reassignTicket and getAllUsers functions
- `app/login/page.tsx` - Added forgot password UI
- `app/dashboard/page.tsx` - Added reassignment UI and updated delete permissions

---

## ✅ Next Steps

1. **Run the SQL scripts** (see Step 1 and Step 2 above)
2. **Test password reset** with your email
3. **Test ticket reassignment** with multiple users
4. **Deploy to production** when ready

Enjoy your new features! 🎉

