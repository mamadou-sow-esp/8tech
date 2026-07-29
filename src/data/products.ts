export type Product = {
  id: number
  name: string
  price: number
  seller: string
  rating: number
  category: string
  image_url?: string
  images?: string[]
  owner_id?: string
  description?: string
  stock?: number
  condition?: string
}

export const formatPrice = (n: number) => n.toLocaleString('fr-FR') + ' F'