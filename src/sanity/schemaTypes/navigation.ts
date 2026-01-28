export const navigation = {
  name: 'navigation',
  title: 'Navigation Menus',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Menu Name',
      type: 'string',
      description: 'e.g., Main Header, Footer Column 1',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'menuId',
      title: 'Menu ID (Slug)',
      type: 'slug',
      description: 'Unique ID used in code (e.g., header-menu, footer-menu)',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Menu Links',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Link',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'URL', type: 'string' },
          ],
        },
      ],
    },
  ],
};