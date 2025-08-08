import nodemailer from 'nodemailer';

// Create transporter (configure based on your email provider)
const createTransporter = () => {
  // For development, you can use a service like Mailtrap or configure SMTP
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransporter({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || 'test',
        pass: process.env.MAILTRAP_PASS || 'test'
      }
    });
  }

  // For production, configure with your actual SMTP settings
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendAdminNotification = async (jobRequest) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@drone-depot.ai',
    to: process.env.ADMIN_NOTIFY_EMAIL || 'ops@drone-depot.ai',
    subject: `New Job Request: ${jobRequest.jobNumber}`,
    html: `
      <h2>New Job Request Received</h2>
      <p><strong>Job Number:</strong> ${jobRequest.jobNumber}</p>
      <p><strong>Name:</strong> ${jobRequest.fullName}</p>
      <p><strong>Email:</strong> ${jobRequest.email}</p>
      <p><strong>Phone:</strong> ${jobRequest.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${jobRequest.company || 'Not provided'}</p>
      <p><strong>Industry:</strong> ${jobRequest.industry}</p>
      <p><strong>Location:</strong> ${jobRequest.location.addressLine1}, ${jobRequest.location.city}, ${jobRequest.location.state} ${jobRequest.location.postalCode}</p>
      <p><strong>Budget Band:</strong> ${jobRequest.budgetBand || 'Not specified'}</p>
      <p><strong>Must Have Shots:</strong> ${jobRequest.mustHaveShots || 'Not specified'}</p>
      <p><strong>Referral:</strong> ${jobRequest.referral || 'Not specified'}</p>
      <p><strong>Date Window:</strong> ${jobRequest.dateWindow?.start || 'Not specified'} to ${jobRequest.dateWindow?.end || 'Not specified'}</p>
      <br>
      <p><a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3001/admin'}/leads/${jobRequest.id}">View in Dashboard</a></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent for job ${jobRequest.jobNumber}`);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    throw error;
  }
};

export const sendClientConfirmation = async (jobRequest) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@drone-depot.ai',
    to: jobRequest.email,
    subject: `Job Request Confirmed: ${jobRequest.jobNumber}`,
    html: `
      <h2>Job Request Confirmed</h2>
      <p>Hi ${jobRequest.fullName},</p>
      <p>Thank you for your job request! We've received your submission and are excited to help you with your aerial photography needs.</p>
      
      <h3>Job Details</h3>
      <p><strong>Job Number:</strong> ${jobRequest.jobNumber}</p>
      <p><strong>Industry:</strong> ${jobRequest.industry.replace('_', ' ').toUpperCase()}</p>
      <p><strong>Location:</strong> ${jobRequest.location.addressLine1}, ${jobRequest.location.city}, ${jobRequest.location.state} ${jobRequest.location.postalCode}</p>
      
      <h3>What's Next?</h3>
      <ul>
        <li>We'll assign a FAA-certified pilot within 2 hours</li>
        <li>You'll receive a detailed proposal within 24 hours</li>
        <li>We'll coordinate scheduling based on your date window</li>
      </ul>
      
      <h3>Contact Information</h3>
      <p>If you have any questions, please don't hesitate to reach out:</p>
      <p>Email: ops@drone-depot.ai<br>
      Phone: (555) 123-4567</p>
      
      <p>Thank you for choosing DroneDepot!</p>
      <p>Best regards,<br>The DroneDepot Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Client confirmation sent for job ${jobRequest.jobNumber}`);
  } catch (error) {
    console.error('Failed to send client confirmation:', error);
    throw error;
  }
};

