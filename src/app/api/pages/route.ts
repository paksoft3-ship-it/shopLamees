import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, titleAr, titleEn, contentAr, contentEn, status } = body;

    const page = await prisma.page.create({
      data: {
        slug,
        titleAr,
        titleEn,
        contentAr,
        contentEn,
        status: status || 'published'
      }
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
