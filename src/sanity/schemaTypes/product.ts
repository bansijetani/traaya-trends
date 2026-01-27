export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'oldPrice',
      title: 'Old Price',
      type: 'number',
    },
    // 👇 ADDED THIS FIELD TO MATCH YOUR DATA
    {
      name: 'description',
      title: 'Description',
      type: 'text', // 'text' is better for long descriptions than 'string'
    },
    {
      name: 'details',
      title: 'Details',
      type: 'string',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference', // 👈 Changed from 'string' to 'reference'
      to: [{ type: 'category' }], // 👈 Points to your new Category document
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
    },
  ],
}