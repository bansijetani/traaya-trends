export function generateEmailHtml(content: { 
    subject: string, 
    greeting?: string, 
    message: string, 
    buttonText?: string, 
    buttonUrl?: string 
}) {
    // Convert newlines in the message to HTML line breaks
    const formattedMessage = content.message.replace(/\n/g, '<br/>');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
            body { font-family: 'Times New Roman', serif; background-color: #F9F9F9; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E5E5; }
            .header { background-color: #1A1A1A; padding: 30px; text-align: center; }
            .logo { font-size: 24px; color: #ffffff; letter-spacing: 2px; font-weight: bold; text-transform: uppercase; text-decoration: none; }
            .content { padding: 40px 30px; color: #1A1A1A; line-height: 1.8; font-family: sans-serif; }
            .greeting { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .btn-container { text-align: center; margin-top: 30px; margin-bottom: 20px; }
            .btn { background-color: #B87E58; color: #ffffff !important; padding: 14px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; display: inline-block; border-radius: 2px; }
            .footer { background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #E5E5E5; }
            .footer a { color: #888888; text-decoration: underline; margin: 0 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="https://traayatrends.com" class="logo">Traaya Trends</a>
            </div>

            <div class="content">
                ${content.greeting ? `<div class="greeting">Hi ${content.greeting},</div>` : ''}
                
                <div>
                    ${formattedMessage}
                </div>

                ${content.buttonText && content.buttonUrl ? `
                <div class="btn-container">
                    <a href="${content.buttonUrl}" class="btn">${content.buttonText}</a>
                </div>
                ` : ''}
            </div>

            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Traaya Trends. All rights reserved.</p>
                <p>
                    <a href="#">Instagram</a> • 
                    <a href="#">Website</a> • 
                    <a href="#">Contact Support</a>
                </p>
                <p>Berlin, Germany</p>
            </div>
        </div>
    </body>
    </html>
    `;
}