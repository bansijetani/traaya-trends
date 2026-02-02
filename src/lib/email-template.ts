import * as React from 'react';

interface EmailProps {
  subject: string;
  greeting: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
  // Optional: Order Details for Admin Emails
  orderDetails?: {
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    items: any[];
    shippingAddress: string;
  };
}

// 1. STANDARD CUSTOMER EMAIL (What you already have)
export const generateEmailHtml = ({ greeting, message, buttonText, buttonUrl }: EmailProps) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-w-idth: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border: 1px solid #e5e5e5; text-align: center;">
          <h2 style="color: #1a1a1a; font-family: serif; font-size: 24px; margin-bottom: 20px;">
            ${greeting ? `Hi ${greeting},` : 'Hello,'}
          </h2>
          <p style="color: #555555; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          
          ${buttonText && buttonUrl ? `
            <a href="${buttonUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
              ${buttonText}
            </a>
          ` : ''}
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0 20px;" />
          <p style="color: #999; font-size: 12px;">© Traaya Trends. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
};

// 2. NEW: ADMIN ORDER ALERT (Data-Rich)
export const generateAdminEmailHtml = ({ orderDetails }: { orderDetails: NonNullable<EmailProps['orderDetails']> }) => {
    const { orderNumber, customerName, totalAmount, items, shippingAddress } = orderDetails;
    
    // Create list of items
    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${item.name || item.product?.name || 'Product'}</td>
            <td style="padding: 10px;">x${item.quantity}</td>
            <td style="padding: 10px;">$${item.price || item.product?.price}</td>
        </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-left: 5px solid #4CAF50;">
            
            <h1 style="color: #333; font-size: 20px; margin-top: 0;">💰 New Order Received!</h1>
            <p style="font-size: 14px; color: #666;">Great news! You just made a sale.</p>
            
            <div style="background: #f9f9f9; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order:</strong> #${orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerName}</p>
                <p style="margin: 5px 0;"><strong>Total:</strong> <span style="color: #4CAF50; font-weight: bold; font-size: 16px;">$${totalAmount}</span></p>
            </div>

            <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px; font-size: 16px;">Items Ordered</h3>
            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #eee;">
                        <th style="padding: 10px;">Item</th>
                        <th style="padding: 10px;">Qty</th>
                        <th style="padding: 10px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div style="margin-top: 20px; font-size: 14px; color: #555;">
                <strong>Shipping To:</strong><br>
                ${shippingAddress}
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <a href="https://traaya-trends.sanity.studio" style="background: #333; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">View in Admin Panel</a>
            </div>
          </div>
        </body>
      </html>
    `;
};