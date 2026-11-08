
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetOtp({ to, otp }) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
    }

    const sender =
        process.env.EMAIL_FROM ||
        "Smart AC <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
        from: sender,
        to: [to],
        subject: "Smart AC - Password Reset OTP",

        text: `Your Smart AC password reset OTP is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: auto;
                padding: 30px;
                color: #061A3A;
                background: #f8fafc;
                border-radius: 16px;
            ">
                <h2 style="color: #061A3A;">
                    Smart AC Password Reset
                </h2>

                <p>Hello,</p>

                <p>
                    We received a request to reset your Smart AC account password.
                    Use the verification code below:
                </p>

                <div style="
                    background: #061A3A;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 12px;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                ">
                    ${otp}
                </div>

                <p>
                    This code expires in <strong>10 minutes</strong>.
                </p>

                <p>
                    Never share this code with anyone.
                    If you did not request a password reset, you can ignore this email.
                </p>

                <hr style="border: 0; border-top: 1px solid #ddd;" />

                <p style="font-size: 12px; color: #64748b;">
                    Smart AC · Energy-aware comfort
                </p>
            </div>
        `
    });

    if (error) {
        throw new Error(error.message || "Unable to send OTP email");
    }

    return data;
}

module.exports = sendPasswordResetOtp;
