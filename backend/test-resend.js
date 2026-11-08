
require("dotenv").config();

const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is missing from .env");
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: "Smart AC <onboarding@resend.dev>",

            to: ["vishamveer9958@gmail.com"],

            subject: "Smart AC - Email Configuration Test",

            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Welcome to Smart AC!</h2>
                    <p>Your email service is connected successfully.</p>
                    <p>We will use this service for password recovery OTPs.</p>
                </div>
            `
        });

        if (error) {
            console.error("Email sending failed:", error);
            process.exitCode = 1;
            return;
        }

        console.log("Email accepted by Resend!");
        console.log("Email ID:", data.id);

    } catch (error) {
        console.error("Unexpected error:", error);
        process.exitCode = 1;
    }
}

sendTestEmail();
