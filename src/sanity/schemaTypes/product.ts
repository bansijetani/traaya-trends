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
        source: 'name', // Auto-generate from name
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'salePrice',
      title: 'Sale Price',
      type: 'number', 
      description: 'Optional. If set, the original price will show as crossed out.'
    },
    // ADDED THIS FIELD TO MATCH YOUR DATA
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
      name: 'gallery',
      title: 'Product Gallery',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'sku',
      title: 'SKU (Stock Keeping Unit)',
      type: 'string',
      validation: (Rule: any) => Rule.required().error('SKU is required for inventory tracking'),
    },
    {
      name: 'stockLevel',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'stockStatus',
      title: 'Stock Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'instock' },
          { title: 'Out of Stock', value: 'outstock' },
          { title: 'Low Stock', value: 'lowstock' },
        ],
        layout: 'radio' // or 'dropdown'
      },
      initialValue: 'instock',
    },
    {
      name: 'materials',
      title: 'Available Materials/Colors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Example: Gold, Silver, Rose Gold. Press Enter after each one.',
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Example: 48, 50, 52, or S, M, L. Press Enter after each one.',
    },
    {
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Example: Emerald Green, Ruby Red, Onyx Black. Press Enter after each one.',
    },
    {
        name: 'addedBy',
        title: 'Added By',
        type: 'string',
        readOnly: true, // Optional: Makes it uneditable in Sanity Studio
    },
  ],
}