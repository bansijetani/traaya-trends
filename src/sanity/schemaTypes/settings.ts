export const settings = {
  name: 'settings',
  title: 'Theme Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
      description: 'Main brand color (e.g., buttons, highlights)',
      initialValue: '#1A1A1A',
    },
    {
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'string',
      description: 'Accent color (e.g., hover states)',
      initialValue: '#B87E58',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: '#FFFFFF',
    },
  ],
};