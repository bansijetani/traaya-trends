export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    },
    {
        name: 'image',
        title: 'Category Image',
        type: 'image',
        options: { hotspot: true },
    },
    // 👇 ADD THIS FIELD
    {
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{type: 'category'}],
      description: 'Select a parent category if this is a sub-category',
    }
  ],
}