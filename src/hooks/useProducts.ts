'use client'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types'

async function fetchProducts(params?: Record<string, string>): Promise<Product[]> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await fetch(`/api/productos${qs}`)
  if (!res.ok) throw new Error('Error fetching products')
  return res.json()
}

async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`/api/productos/${slug}`)
  if (!res.ok) throw new Error('Error fetching product')
  return res.json()
}

export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  })
}
