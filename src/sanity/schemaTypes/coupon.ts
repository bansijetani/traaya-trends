import { defineType, defineField } from "sanity";

export const coupon = defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'The exact code the customer enters (e.g., SUMMER20)',
      validation: (Rule) => Rule.required().uppercase().error('Code is required'),
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage (%)', value: 'percentage' },
          { title: 'Fixed Amount ($)', value: 'fixed' },
        ],
        layout: 'radio',
      },
      initialValue: 'percentage',
    }),
    defineField({
      name: 'value',
      title: 'Discount Value',
      type: 'number',
      description: 'E.g., 20 for 20% off, or 10 for $10 off',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'datetime',
      description: 'The code will stop working after this date',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Turn this off to manually disable the coupon',
    }),
    defineField({
      name: 'usedBy',
      title: 'Used By (Emails)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of emails that have already used this coupon',
      initialValue: [],
    }),
    defineField({
      name: 'minSpend',
      title: 'Minimum Spend ($)',
      type: 'number',
      description: 'Minimum cart total required to use this coupon (Set to 0 for no limit)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'code',
      value: 'value',
      type: 'discountType',
      active: 'isActive',
    },
    prepare({ title, value, type, active }) {
      const typeLabel = type === 'percentage' ? '%' : '$';
      return {
        title: title,
        subtitle: `${value}${typeLabel} off - ${active ? 'Active' : 'Inactive'}`,
      };
    },
  },
});