# Step Description Formatting Guide

You can now use **markdown formatting** in step descriptions in `lib/constants.ts`!

---

## ✅ Supported Formatting

### 1. **Links**

**Syntax:**
```
[Link Text](https://url.com)
```

**Example:**
```typescript
{
  id: 1,
  title: 'Schedule the Job',
  description: 'Add job to [Field Team Spreadsheet](https://docs.google.com/spreadsheets) and create [Google Calendar](https://calendar.google.com) invite'
}
```

**Result:**
```
Add job to Field Team Spreadsheet and create Google Calendar invite
          ^^^^^^^^^^^^^^^^^^^^^^           ^^^^^^^^^^^^^^^
          (clickable blue links)
```

---

### 2. **Bullet Points**

**Syntax:** Start lines with `-` or `*` or `•`

**Example:**
```typescript
{
  id: 2,
  title: 'Confirm Job with Client',
  description: 'Contact client to confirm:\n- Job date and time\n- Site location and access\n- Special requirements\n- Contact person on-site'
}
```

**Result:**
```
Contact client to confirm:
• Job date and time
• Site location and access
• Special requirements
• Contact person on-site
```

---

### 3. **Combining Links and Bullets**

**Example:**
```typescript
{
  id: 1,
  title: 'Schedule the Job',
  description: 'Complete the following:\n- Add to [Field Team Spreadsheet](https://docs.google.com/spreadsheets)\n- Create [Google Calendar](https://calendar.google.com) invite with PROJ- prefix\n- Notify team in [Slack](https://slack.com)'
}
```

**Result:**
```
Complete the following:
• Add to Field Team Spreadsheet (clickable)
• Create Google Calendar invite with PROJ- prefix (clickable)
• Notify team in Slack (clickable)
```

---

## 📝 **Formatting Tips**

### **Line Breaks**
Use `\n` for new lines:
```typescript
description: 'First line\nSecond line\nThird line'
```

### **Multiple Paragraphs**
Use `\n\n` for paragraph breaks:
```typescript
description: 'First paragraph with details.\n\nSecond paragraph with more info.'
```

### **Bullet Lists**
Each bullet on a new line with `-` or `*`:
```typescript
description: 'Items to check:\n- Item 1\n- Item 2\n- Item 3'
```

---

## 🎨 **Link Styling**

Links automatically:
- ✅ Open in new tab
- ✅ Show as blue and underlined
- ✅ Change to darker blue on hover
- ✅ Are bold for visibility

---

## 📋 **Full Example**

```typescript
export const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    id: 1,
    title: 'Schedule the Job',
    description: 'Ensure job is scheduled:\n- Add to [Field Team Spreadsheet](https://docs.google.com/spreadsheets/d/1rYt_fyrlUMnSZB97MwX-XVBHNyJSpYeKerGR1GwxE_Y/edit?gid=0#gid=0)\n- Create [Google Calendar](https://calendar.google.com) invite with PROJ- prefix\n- Confirm with client via email'
  },
  {
    id: 2,
    title: 'Confirm Job with Client',
    description: 'Contact client to verify:\n- Date and time\n- Site location: [Google Maps](https://maps.google.com)\n- Access requirements\n- Contact person details'
  },
  {
    id: 3,
    title: 'Collect Site Materials',
    description: 'Gather all necessary materials:\n- Site maps and diagrams\n- Previous survey data from [Dropbox](https://dropbox.com)\n- Contact information\n- Safety requirements'
  },
  // ... more steps
];
```

---

## 🚀 **How to Use**

1. **Edit** `lib/constants.ts`
2. **Add links** using `[text](url)` syntax
3. **Add bullets** using `- ` at start of lines
4. **Use `\n`** for line breaks
5. **Save** the file
6. **Create a new ticket** to see the formatting
7. **Open the ticket** and view the step descriptions

---

## ⚠️ **Important Notes**

- ✅ Formatting works in **step descriptions only**
- ✅ Changes apply to **new tickets only** (existing tickets keep old formatting)
- ✅ Links open in **new tabs** for safety
- ✅ All three bullet styles work: `-`, `*`, `•`

---

## 🎯 **Example Output**

When you view a ticket step, you'll see:

```
┌─────────────────────────────────────────────┐
│ Step 1 of 20                                │
│                                             │
│ Schedule the Job                            │
│                                             │
│ Ensure job is scheduled:                    │
│ • Add to Field Team Spreadsheet (blue link) │
│ • Create Google Calendar invite with        │
│   PROJ- prefix (blue link)                  │
│ • Confirm with client via email             │
└─────────────────────────────────────────────┘
```

---

**Happy formatting! 🎉**

