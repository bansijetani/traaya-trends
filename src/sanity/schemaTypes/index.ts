import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import order from './order'
import category from './category' // 👈 Import this
import { userSchema } from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, userSchema, order, category], // 👈 Add it here
}