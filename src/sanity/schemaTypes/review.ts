import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Reviewer Name',
      type: 'string',
      readOnly: true, // Optional: Prevent editing original user input
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      readOnly: true,
      validation: (Rule) => Rule.required().min(1).max(5)
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
    }),
    // 👇 NEW FIELD FOR MODERATION
    defineField({
      name: 'status',
      title: 'Review Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio', // Nice UI buttons
      },
      initialValue: 'pending', // Default to pending
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})