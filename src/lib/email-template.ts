import * as React from 'react';

interface EmailProps {
  subject?: string; // Made optional as it's usually for the transporter
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

// 🎨 THEME CONSTANTS
const COLORS = {
  primary: "#1A1A1A", // Dark Black/Gray
  accent: "#B87E58",  // Gold/Brown
  bg: "#F9F9F9",      // Light Gray Background
  white: "#FFFFFF",
  border: "#E5E5E5"
};

// 🖼️ YOUR LOGO URL 
// (IMPORTANT: Replace this with the actual public URL of your logo from Sanity or your website)
const LOGO_URL = "https://your-domain.com/logo.png"; 

// 1. STANDARD CUSTOMER EMAIL (Welcome, Reset Password, General Info)
export const generateEmailHtml = ({ greeting, message, buttonText, buttonUrl }: EmailProps) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${COLORS.bg}; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background: ${COLORS.white}; padding: 0; border: 1px solid ${COLORS.border};">
          
          <div style="text-align: center; padding: 40px 40px 20px; border-bottom: 2px solid ${COLORS.accent};">
            <h1 style="font-family: 'Times New Roman', serif; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; margin: 0; color: ${COLORS.primary};">
              TRAAYA TRENDS
            </h1>
            </div>

          <div style="padding: 40px 40px;">
            <h2 style="color: ${COLORS.primary}; font-family: 'Times New Roman', serif; font-size: 24px; margin-top: 0; margin-bottom: 20px;">
              ${greeting ? `Hi ${greeting},` : 'Hello,'}
            </h2>
            
            <p style="color: #555555; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
              ${message.replace(/\n/g, '<br>')}
            </p>
            
            ${buttonText && buttonUrl ? `
              <div style="text-align: center; margin: 40px 0;">
                <a href="${buttonUrl}" style="display: inline-block; background-color: ${COLORS.primary}; color: ${COLORS.white}; padding: 16px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; border: 1px solid ${COLORS.primary};">
                  ${buttonText}
                </a>
              </div>
            ` : ''}

            <p style="color: #888; font-size: 14px; line-height: 1.6;">
              If you have any questions, simply reply to this email or contact our client care team.
            </p>
          </div>
          
          <div style="background-color: ${COLORS.primary}; padding: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; letter-spacing: 1px; margin: 0;">© TRAAYA TRENDS. ALL RIGHTS RESERVED.</p>
            <div style="margin-top: 10px;">
              <a href="#" style="color: ${COLORS.accent}; text-decoration: none; font-size: 12px; margin: 0 10px;">Shop</a>
              <a href="#" style="color: ${COLORS.accent}; text-decoration: none; font-size: 12px; margin: 0 10px;">Account</a>
              <a href="#" style="color: ${COLORS.accent}; text-decoration: none; font-size: 12px; margin: 0 10px;">Instagram</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// 2. ADMIN ORDER ALERT (Data-Rich, Organized)
export const generateAdminEmailHtml = ({ orderDetails }: { orderDetails: NonNullable<EmailProps['orderDetails']> }) => {
    const { orderNumber, customerName, totalAmount, items, shippingAddress } = orderDetails;
    
    // Create list of items
    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px 10px; color: #333;">
              <strong>${item.name || item.product?.name || 'Product'}</strong>
            </td>
            <td style="padding: 15px 10px; text-align: center; color: #555;">x${item.quantity}</td>
            <td style="padding: 15px 10px; text-align: right; color: #333;">$${item.price || item.product?.price}</td>
        </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: ${COLORS.white}; padding: 0; border-top: 5px solid ${COLORS.accent}; shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <div style="padding: 30px; border-bottom: 1px solid #eee;">
                <h1 style="color: ${COLORS.primary}; font-family: 'Times New Roman', serif; font-size: 22px; margin: 0;">
                    💰 New Order Received
                </h1>
                <p style="font-size: 14px; color: #666; margin-top: 5px;">You have a new sale on Traaya Trends.</p>
            </div>
            
            <div style="padding: 30px;">
                <div style="background: #FAFAFA; padding: 20px; border: 1px solid #eee; margin-bottom: 30px;">
                    <table style="width: 100%;">
                        <tr>
                            <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order Number</td>
                            <td style="text-align: right; font-weight: bold; color: ${COLORS.primary};">#${orderNumber}</td>
                        </tr>
                        <tr>
                            <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Customer</td>
                            <td style="text-align: right; font-weight: bold; color: ${COLORS.primary};">${customerName}</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Total Amount</td>
                            <td style="padding-top: 10px; text-align: right; font-size: 20px; font-weight: bold; color: ${COLORS.accent};">
                                $${totalAmount}
                            </td>
                        </tr>
                    </table>
                </div>

                <h3 style="font-family: 'Times New Roman', serif; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 0; font-size: 18px;">Order Details</h3>
                <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background: #fff; border-bottom: 2px solid #eee;">
                            <th style="padding: 10px; text-transform: uppercase; font-size: 10px; color: #888;">Item</th>
                            <th style="padding: 10px; text-align: center; text-transform: uppercase; font-size: 10px; color: #888;">Qty</th>
                            <th style="padding: 10px; text-align: right; text-transform: uppercase; font-size: 10px; color: #888;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 10px;">Shipping Destination</p>
                    <p style="color: #333; line-height: 1.6; background: #fff; font-size: 14px;">
                        ${shippingAddress.replace(/\n/g, '<br>')}
                    </p>
                </div>
            </div>

            <div style="background: #FAFAFA; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                <a href="https://traaya-trends.sanity.studio" style="display: inline-block; background: ${COLORS.primary}; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 2px; font-size: 14px;">
                    Process Order in Sanity
                </a>
            </div>
          </div>
        </body>
      </html>
    `;
};