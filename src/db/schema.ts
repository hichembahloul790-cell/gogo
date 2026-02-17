import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Report categories
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"), // Icon name for UI
  color: text("color").default("#3b82f6"), // Color for UI
  order: integer("order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Reports/Signalements
export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trackingNumber: text("tracking_number").notNull().unique(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  
  // Reporter information (optional)
  reporterEmail: text("reporter_email"),
  reporterPhone: text("reporter_phone"),
  
  // Incident details
  incidentUrl: text("incident_url"),
  incidentDate: integer("incident_date", { mode: "timestamp" }),
  incidentDescription: text("incident_description").notNull(),
  
  // Location (if applicable)
  location: text("location"),
  
  // Status tracking
  status: text("status").notNull().default("pending"), // pending, in_review, resolved, rejected
  priority: text("priority").default("normal"), // low, normal, high, urgent
  
  // Admin notes (not visible to reporter)
  adminNotes: text("admin_notes"),
  
  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  
  // Resolution
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
  resolution: text("resolution"),
});

// Status updates (history)
export const statusUpdates = sqliteTable("status_updates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reportId: integer("report_id").notNull().references(() => reports.id),
  status: text("status").notNull(),
  note: text("note"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Attachments (for evidence)
export const attachments = sqliteTable("attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reportId: integer("report_id").notNull().references(() => reports.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
