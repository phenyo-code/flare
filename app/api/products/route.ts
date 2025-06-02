import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
  category: z.string().nullish(),
  filter: z.string().nullish(),
  style: z.string().nullish(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  sort: z.enum(['createdAt:desc', 'createdAt:asc', 'price:asc', 'price:desc']).optional().default('createdAt:desc'),
});

type ProductResponse = {
  success: boolean;
  data?: { products: any[]; total: number };
  metadata?: { page: number; limit: number };
  error?: string;
  errorDetails?: any;
  status: number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedParams = querySchema.safeParse({
      category: searchParams.get('category'),
      filter: searchParams.get('filter'),
      style: searchParams.get('style'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sort: searchParams.get('sort'),
    });

    if (!parsedParams.success) {
      console.error('Validation error:', parsedParams.error.flatten());
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          errorDetails: parsedParams.error.flatten(),
          status: 400,
        },
        { status: 400 }
      );
    }

    const { category, filter, style, page, limit, sort } = parsedParams.data;
    console.log('Parsed query parameters:', { category, filter, style, page, limit, sort }); // Debug log

    const where: any = {};
    if (category != null) where.category = { equals: category, mode: 'insensitive' };
    if (filter != null) where.filter = { equals: filter, mode: 'insensitive' };
    if (style != null) where.style = { equals: style, mode: 'insensitive' };

    const [sortField, sortDirection] = sort.split(':');
    const orderBy = { [sortField]: sortDirection };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          sizes: true,
          reviews: { include: { user: { select: { name: true } } } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const processedProducts = products.map((product) => ({
      ...product,
      Originalprice: product.Originalprice ?? null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: { products: processedProducts, total },
        metadata: { page, limit },
        status: 200,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', status: 500 },
      { status: 500 }
    );
  }
}