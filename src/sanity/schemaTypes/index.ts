import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import order from './order'
import category from './category' // 👈 Import this
import { userSchema } from './user'
import { settings } from "./settings";
import { navigation } from "./navigation";
import { coupon } from './coupon';
import { contact } from './contact';
import  review  from './review';
import returnRequest from './returnRequest';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, userSchema, order, category, settings, navigation, coupon, contact, review, returnRequest], // Add it here
}