import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import order from './order'
import category from './category' // 👈 Import this
import { userSchema } from './user'
import { settings } from "./settings";
import { navigation } from "./navigation";
import { coupon } from './coupon'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, userSchema, order, category, settings, navigation, coupon], // Add it here
}