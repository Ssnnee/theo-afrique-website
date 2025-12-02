# Announcements Feature Guide

## Overview
The announcements system allows you to create promotional campaigns with automatic price discounts that are applied site-wide, per-category, or per-product.

## Features
- **Automatic discount calculation**: Supports both percentage (e.g., 20%) and fixed amount (e.g., 500 CFA) discounts
- **Flexible scope**: Global (all products), category-specific, or product-specific announcements
- **One active announcement**: Only the highest priority announcement is shown at a time
- **Date-based activation**: Announcements automatically activate/deactivate based on start/end dates
- **Visual indicators**: Products show original price (strikethrough) and discounted price with percentage badge

## Database Schema

### Announcements Table
- `id`: Primary key
- `title`: Announcement title (e.g., "Black Friday Sale")
- `message`: Detailed message
- `type`: "sale" | "promotion" | "info" | "warning"
- `discountType`: "percentage" | "fixed"
- `discountValue`: Number (e.g., 20 for 20%, or 500 for 500 CFA)
- `startDate`: When the announcement becomes active
- `endDate`: When it expires
- `isActive`: Manual on/off toggle
- `scope`: "global" | "category" | "product"
- `priority`: Higher values = higher priority (only one shown at a time)

### Junction Tables
- `announcementsToProducts`: Links announcements to specific products
- `announcementsToCategories`: Links announcements to specific categories

## API Usage (tRPC)

### Get Active Announcement
```typescript
const { data: announcement } = api.announcement.getActive.useQuery();
```

### Create Announcement
```typescript
// Global announcement (applies to all products)
const createGlobal = api.announcement.create.useMutation();
await createGlobal.mutateAsync({
  title: "Black Friday Sale",
  message: "50% off everything!",
  type: "sale",
  discountType: "percentage",
  discountValue: 50,
  startDate: new Date("2025-11-29"),
  endDate: new Date("2025-12-02"),
  scope: "global",
  priority: 100,
});

// Category-specific announcement
const createCategory = api.announcement.create.useMutation();
await createCategory.mutateAsync({
  title: "Summer Dresses Sale",
  message: "30% off all dresses",
  type: "sale",
  discountType: "percentage",
  discountValue: 30,
  startDate: new Date(),
  endDate: new Date("2025-12-31"),
  scope: "category",
  categoryIds: [1, 2], // Category IDs
  priority: 50,
});

// Product-specific announcement
const createProduct = api.announcement.create.useMutation();
await createProduct.mutateAsync({
  title: "Clearance Item",
  message: "500 CFA off this item",
  type: "sale",
  discountType: "fixed",
  discountValue: 500,
  startDate: new Date(),
  endDate: new Date("2025-12-15"),
  scope: "product",
  productIds: [5, 10], // Product IDs
  priority: 10,
});
```

### Update Announcement
```typescript
const update = api.announcement.update.useMutation();
await update.mutateAsync({
  id: 1,
  discountValue: 40, // Change from 50% to 40%
  endDate: new Date("2025-12-05"), // Extend end date
});
```

### Toggle Active Status
```typescript
const toggle = api.announcement.toggleActive.useMutation();
await toggle.mutateAsync({ id: 1 });
```

### Delete Announcement
```typescript
const deleteAnnouncement = api.announcement.delete.useMutation();
await deleteAnnouncement.mutateAsync({ id: 1 });
```

## How Discounts Work

1. When products are queried, the system automatically:
   - Fetches the active announcement (highest priority, within date range)
   - Applies the discount to matching products based on scope
   - Calculates `discountedPrice` and `discountPercentage`

2. The `ProductCard` component displays:
   - Original price (strikethrough) if discount exists
   - Discounted price in bold
   - Red badge showing percentage off (e.g., "-20%")

3. Priority system:
   - Only ONE announcement is active at a time
   - The announcement with the highest `priority` value is chosen
   - If multiple have same priority, the most recently created wins

## Example Scenarios

### Black Friday (Global Sale)
```typescript
{
  title: "Black Friday Mega Sale!",
  type: "sale",
  discountType: "percentage",
  discountValue: 50,
  scope: "global",
  priority: 100,
  startDate: "2025-11-29",
  endDate: "2025-12-02"
}
```

### New Year Category Discount
```typescript
{
  title: "New Year Shoes Sale",
  type: "promotion",
  discountType: "percentage",
  discountValue: 25,
  scope: "category",
  categoryIds: [3], // Shoes category
  priority: 50,
  startDate: "2025-12-26",
  endDate: "2026-01-05"
}
```

### Flash Sale on Specific Products
```typescript
{
  title: "Flash Sale - Limited Stock",
  type: "warning",
  discountType: "fixed",
  discountValue: 1000,
  scope: "product",
  productIds: [7, 12, 18],
  priority: 75,
  startDate: "2025-12-10T10:00:00",
  endDate: "2025-12-10T18:00:00"
}
```

## Files Modified

- `src/server/db/schema.ts`: Added announcements tables and relations
- `src/server/api/routers/announcement.ts`: tRPC router for CRUD operations
- `src/server/api/routers/product.ts`: Automatic discount application
- `src/server/api/root.ts`: Registered announcement router
- `src/types/index.ts`: Added AnnouncementSchema and updated ProductSchema
- `src/lib/utils.ts`: Discount calculation helpers
- `src/app/_components/product-card.tsx`: Visual display of discounts

## Notes

- Database was recreated with corrected schema (old backup saved as `db.sqlite.backup`)
- User IDs changed from integer to text (UUID) for NextAuth v5 compatibility
- Added `image` field to users table (required by NextAuth)
- Category names now have unique constraint
- All changes follow T3 Stack patterns and Biome formatting rules
