import { defineField, defineType } from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'Inquiries', // 👈 Renamed to "Inquiries" for the menu
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      readOnly: true, // 🔒 Lock it so you don't accidentally change it
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
            { title: 'New', value: 'new' },
            { title: 'Read', value: 'read' },
            { title: 'Replied', value: 'replied' }
        ],
        layout: 'radio' // Shows as clickable buttons instead of a dropdown
      },
      initialValue: 'new',
    }),
    // 👇 ADD THESE TWO NEW FIELDS:
    defineField({
      name: 'replyMessage',
      title: 'Admin Reply',
      type: 'text',
      readOnly: true, 
    }),
    defineField({
      name: 'repliedAt',
      title: 'Replied At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  // 👇 THIS PART CONTROLS THE LIST APPEARANCE
  preview: {
    select: {
      title: 'subject',
      subtitle: 'email',
      status: 'status'
    },
    prepare(selection) {
      const { title, subtitle, status } = selection
      
      // Add a Red Dot 🔴 if the status is 'new'
      const statusEmoji = status === 'new' ? '🔴 ' : status === 'replied' ? '✅ ' : '👀 '

      return {
        title: `${statusEmoji} ${title || 'No Subject'}`,
        subtitle: `${subtitle} — ${new Date().toLocaleDateString()}` 
      }
    }
  }
})