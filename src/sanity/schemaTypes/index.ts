import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import order from './order'
import category from './category' // 👈 Import this

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, order, category], // 👈 Add it here
}