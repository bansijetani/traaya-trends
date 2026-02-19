import { defineField, defineType } from "sanity";

export default defineType({
  name: 'returnRequest',
  title: 'Return Requests',
  type: 'document',
  fields: [
    defineField({ name: 'orderNumber', title: 'Order Number', type: 'string' }),
    defineField({ name: 'productName', title: 'Product Name', type: 'string' }),
    defineField({ name: 'email', title: 'Customer Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'reason', title: 'Reason for Return', type: 'string' }),
    defineField({ name: 'message', title: 'Additional Comments', type: 'text' }),
    defineField({ 
      name: 'status', 
      title: 'Status', 
      type: 'string',
      options: { 
        list: ['Pending', 'Approved', 'Rejected', 'Refunded'],
        layout: 'radio'
      },
      initialValue: 'Pending'
    }),
    defineField({ 
      name: 'proofFile', 
      title: 'Proof File (Image/Video)', 
      type: 'file', // 'file' allows both images and mp4 videos
      options: { accept: 'image/*,video/mp4' }
    }),
    defineField({ name: 'createdAt', title: 'Date Requested', type: 'datetime' })
  ]
});