import { NextResponse } from "next/server";
import { db } from "@/db";
import { reports, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function generateTrackingNumber(): string {
  const prefix = "SIG";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category,
      incidentUrl,
      incidentDate,
      incidentDescription,
      location,
      reporterEmail,
      reporterPhone,
    } = body;

    // Validate required fields
    if (!category || !incidentDescription) {
      return NextResponse.json(
        { error: "Catégorie et description sont requises" },
        { status: 400 }
      );
    }

    // Find or create category
    const categoryRecord = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, category))
      .limit(1);

    let categoryId: number;

    if (categoryRecord.length === 0) {
      // Create category if it doesn't exist
      const newCategory = await db
        .insert(categories)
        .values({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category,
        })
        .returning();
      categoryId = (newCategory[0] as { id: number }).id;
    } else {
      categoryId = (categoryRecord[0] as { id: number }).id;
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    // Create report
    const newReport = await db
      .insert(reports)
      .values({
        trackingNumber,
        categoryId,
        incidentUrl: incidentUrl || null,
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        incidentDescription,
        location: location || null,
        reporterEmail: reporterEmail || null,
        reporterPhone: reporterPhone || null,
        status: "pending",
        priority: "normal",
      })
      .returning();

    return NextResponse.json({
      success: true,
      trackingNumber: (newReport[0] as { trackingNumber: string }).trackingNumber,
      id: (newReport[0] as { id: number }).id,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du signalement" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("tracking");

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Numéro de suivi requis" },
        { status: 400 }
      );
    }

    const report = await db
      .select({
        id: reports.id,
        trackingNumber: reports.trackingNumber,
        status: reports.status,
        priority: reports.priority,
        incidentDescription: reports.incidentDescription,
        incidentUrl: reports.incidentUrl,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
        resolvedAt: reports.resolvedAt,
        resolution: reports.resolution,
        category: categories.name,
      })
      .from(reports)
      .leftJoin(categories, eq(reports.categoryId, categories.id))
      .where(eq(reports.trackingNumber, trackingNumber))
      .limit(1);

    if (report.length === 0) {
      return NextResponse.json(
        { error: "Signalement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report: report[0],
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la recherche du signalement" },
      { status: 500 }
    );
  }
}
