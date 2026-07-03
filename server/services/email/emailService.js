const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  console.warn("Email service environment variables EMAIL_USER and EMAIL_PASS not set. Email alerts will be printed to console.");
}

exports.sendHighCompatibilityAlert = async ({ ownerEmail, ownerName, tenantName, listingTitle, score }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "noreply@flatmatefinder.com",
    to: ownerEmail,
    subject: `🔥 High Compatibility Tenant Alert - ${score}% Match!`,
    html: `
      <h2>Hello ${ownerName},</h2>
      <p>A highly compatible tenant is interested in your listing: <strong>${listingTitle}</strong>.</p>
      <p><strong>Tenant:</strong> ${tenantName}</p>
      <p><strong>AI Compatibility Score:</strong> ${score}%</p>
      <p>Please log in to your dashboard to review their request and start chatting!</p>
      <br/>
      <p>Best regards,<br/>Rent & Flatmate Finder Team</p>
    `,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`High compatibility email sent to ${ownerEmail}`);
    } catch (error) {
      console.error("Error sending high compatibility email:", error.message);
    }
  } else {
    console.log("---------------- EMAIL SIMULATION (HIGH COMPATIBILITY) ----------------");
    console.log(`To: ${ownerEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body: ${mailOptions.html.replace(/<[^>]+>/g, " ").trim()}`);
    console.log("----------------------------------------------------------------------");
  }
};

exports.sendInterestStatusUpdate = async ({ tenantEmail, tenantName, ownerName, listingTitle, status }) => {
  const isAccepted = status === "Accepted";
  const subject = isAccepted 
    ? `🎉 Good News! Your interest request for ${listingTitle} was Accepted!`
    : `Update on your request for ${listingTitle}`;
    
  const html = `
    <h2>Hello ${tenantName},</h2>
    <p>The owner (<strong>${ownerName}</strong>) has ${isAccepted ? 'accepted' : 'rejected'} your interest request for the listing: <strong>${listingTitle}</strong>.</p>
    ${isAccepted 
      ? `<p>You can now open the dashboard and start chatting with the owner directly!</p>`
      : `<p>We're sorry, but the owner has declined this request. Good luck finding another flatmate!</p>`
    }
    <br/>
    <p>Best regards,<br/>Rent & Flatmate Finder Team</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || "noreply@flatmatefinder.com",
    to: tenantEmail,
    subject: subject,
    html: html,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Status update email sent to ${tenantEmail}`);
    } catch (error) {
      console.error("Error sending interest status email:", error.message);
    }
  } else {
    console.log("---------------- EMAIL SIMULATION (STATUS UPDATE) ----------------");
    console.log(`To: ${tenantEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body: ${mailOptions.html.replace(/<[^>]+>/g, " ").trim()}`);
    console.log("------------------------------------------------------------------");
  }
};
