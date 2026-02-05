import { defineField } from "sanity";

export const userSchema = {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'password', // We will store the HASHED password here
      title: 'Password',
      type: 'string',
      hidden: true, // Hide from Sanity Studio so admins can't see it
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      initialValue: 'customer',
    },
    defineField({
      name: 'isVerified',
      title: 'Is Email Verified?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificationToken',
      title: 'Verification Token',
      type: 'string',
      hidden: true, // Hide from Admin UI so it's not tampered with
    }),
    defineField({
      name: 'resetToken',
      title: 'Reset Token',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetTokenExpiry',
      title: 'Token Expiry',
      type: 'number', // We will store this as a timestamp (Date.now())
      hidden: true,
    }),
    defineField({
      name: 'wishlist',
      title: 'Wishlist',
      type: 'array',
      of: [
        { 
          type: 'reference', 
          to: [{ type: 'product' }] 
        }
      ]
    }),
    defineField({
      name: 'addresses',
      title: 'Saved Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'address',
          fields: [
            { name: 'id', title: 'ID', type: 'string' }, // Unique ID for finding it later
            { name: 'label', title: 'Label', type: 'string', initialValue: 'Home' }, // e.g. "Home", "Office"
            { name: 'name', title: 'Contact Name', type: 'string' },
            { name: 'email', title: 'Contact Email', type: 'string' },
            { name: 'addressLine', title: 'Address', type: 'text' },
            { name: 'city', title: 'City', type: 'string' },
            { name: 'zipCode', title: 'Zip Code', type: 'string' },
            { name: 'phone', title: 'Phone', type: 'string' },
            { name: 'isDefault', title: 'Default Address', type: 'boolean', initialValue: false }
          ],
          preview: {
            select: { title: 'label', subtitle: 'addressLine' }
          }
        }
      ]
    }),
  ],
};