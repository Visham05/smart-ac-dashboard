
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const sendPasswordResetOtp = require("../utils/sendEmail");

const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const router = express.Router();
const otpRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many OTP requests. Please try again later."
    }
});
const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many verification attempts. Please try again later."
    }
});
function hashOtp(userId, email, otp) {
    return crypto
        .createHmac("sha256", process.env.OTP_SECRET)
        .update(`${userId}:${email}:${otp}`)
        .digest("hex");
}

// REGISTER NEW USER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Validate name
        if (!cleanName || cleanName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 1 and 100 characters"
            });
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate password
        if (
            typeof password !== "string" ||
            password.length < 8 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Check whether email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [cleanEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Hash password before storing
        const passwordHash = await bcrypt.hash(password, 12);

        // Save user in Neon PostgreSQL
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [cleanName, cleanEmail, passwordHash]
        );

        return res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong during registration"
        });
    }
});

// USER LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Find registered user
        const result = await pool.query(
            `SELECT id, name, email, password_hash
             FROM users
             WHERE email = $1`,
            [cleanEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare entered password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment");
            return res.status(500).json({
                success: false,
                message: "Server authentication configuration error"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set secure HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login"
        });
    }
});

// GET CURRENT LOGGED-IN USER
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, created_at
             FROM users
             WHERE id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User account not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve user profile"
        });
    }
});


// SEND PASSWORD RESET OTP
router.post("/forgot-password", otpRequestLimiter, async (req, res) => {
    const genericMessage =
        "If an account exists for this email, a verification code has been sent.";

    try {
        const { email } = req.body;

        if (
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (!process.env.OTP_SECRET || !process.env.RESEND_API_KEY) {
            console.error("OTP or email service configuration is missing");

            return res.status(500).json({
                success: false,
                message: "Email service is not configured"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Find registered user
        const userResult = await pool.query(
            "SELECT id, email FROM users WHERE email = $1",
            [cleanEmail]
        );

        // Do not reveal whether an email is registered
        if (userResult.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: genericMessage
            });
        }

        const user = userResult.rows[0];

        // Allow at least 60 seconds between OTP requests
        const recentRequest = await pool.query(
            `SELECT id
             FROM password_reset_otps
             WHERE user_id = $1
               AND created_at > NOW() - INTERVAL '60 seconds'
             ORDER BY created_at DESC
             LIMIT 1`,
            [user.id]
        );

        if (recentRequest.rows.length > 0) {
            return res.status(200).json({
                success: true,
                message: genericMessage
            });
        }

        // Generate a cryptographically random six-digit OTP
        const otp = crypto
            .randomInt(0, 1000000)
            .toString()
            .padStart(6, "0");

        const otpHash = hashOtp(user.id, cleanEmail, otp);

        // Invalidate previous unused OTP requests
        await pool.query(
            `UPDATE password_reset_otps
             SET consumed_at = NOW()
             WHERE user_id = $1
               AND consumed_at IS NULL`,
            [user.id]
        );

        // Save hashed OTP with 10-minute expiration
        const savedOtp = await pool.query(
            `INSERT INTO password_reset_otps
             (user_id, email, otp_hash, expires_at)
             VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes')
             RETURNING id`,
            [user.id, cleanEmail, otpHash]
        );

        const otpId = savedOtp.rows[0].id;

        try {
            // Send email through Resend
            await sendPasswordResetOtp({
                to: cleanEmail,
                otp
            });
        } catch (emailError) {
            console.error("OTP email sending failed:", emailError);

            // Remove unused OTP if email delivery request fails
            await pool.query(
                `DELETE FROM password_reset_otps WHERE id = $1`,
                [otpId]
            );

            return res.status(503).json({
                success: false,
                message: "Unable to send verification email. Please try again later."
            });
        }

        return res.status(200).json({
            success: true,
            message: genericMessage
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to process password recovery"
        });
    }
});


// VERIFY PASSWORD RESET OTP
router.post("/verify-otp", otpVerifyLimiter, async (req, res) => {
    let client;

    try {
        const email =
            typeof req.body.email === "string"
                ? req.body.email.trim().toLowerCase()
                : "";

        const otp =
            typeof req.body.otp === "string"
                ? req.body.otp.trim()
                : "";

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 6-digit OTP"
            });
        }

        if (!process.env.OTP_SECRET) {
            return res.status(500).json({
                success: false,
                message: "OTP service is not configured"
            });
        }

        client = await pool.connect();

        await client.query("BEGIN");

        // Find the latest unused OTP and lock its row
        const result = await client.query(
            `SELECT id, user_id, email, otp_hash, expires_at, attempts
             FROM password_reset_otps
             WHERE email = $1
               AND consumed_at IS NULL
               AND verified_at IS NULL
             ORDER BY created_at DESC
             LIMIT 1
             FOR UPDATE`,
            [email]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP. Request a new code."
            });
        }

        const reset = result.rows[0];

        // Check expiration
        if (new Date(reset.expires_at) <= new Date()) {
            await client.query(
                `UPDATE password_reset_otps
                 SET consumed_at = NOW()
                 WHERE id = $1`,
                [reset.id]
            );

            await client.query("COMMIT");

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new code."
            });
        }

        // Check maximum attempts
        if (reset.attempts >= 5) {
            await client.query(
                `UPDATE password_reset_otps
                 SET consumed_at = NOW()
                 WHERE id = $1`,
                [reset.id]
            );

            await client.query("COMMIT");

            return res.status(429).json({
                success: false,
                message: "Maximum attempts reached. Request a new OTP."
            });
        }

        // Hash the submitted OTP
        const submittedHash = hashOtp(
            reset.user_id,
            email,
            otp
        );

        // Constant-time comparison
        const storedBuffer = Buffer.from(reset.otp_hash, "hex");
        const submittedBuffer = Buffer.from(submittedHash, "hex");

        const matches =
            storedBuffer.length === submittedBuffer.length &&
            crypto.timingSafeEqual(storedBuffer, submittedBuffer);

        if (!matches) {
            const nextAttempts = Number(reset.attempts) + 1;

            await client.query(
                `UPDATE password_reset_otps
                 SET attempts = $1,
                     consumed_at = CASE
                         WHEN $1 >= 5 THEN NOW()
                         ELSE consumed_at
                     END
                 WHERE id = $2`,
                [nextAttempts, reset.id]
            );

            await client.query("COMMIT");

            return res.status(400).json({
                success: false,
                message: nextAttempts >= 5
                    ? "Maximum attempts reached. Request a new OTP."
                    : `Incorrect OTP. ${5 - nextAttempts} attempts remaining.`
            });
        }

        // Generate a separate temporary reset token
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Save verified status and 15-minute reset permission
        await client.query(
            `UPDATE password_reset_otps
             SET verified_at = NOW(),
                 reset_token_hash = $1,
                 reset_token_expires_at = NOW() + INTERVAL '15 minutes'
             WHERE id = $2`,
            [resetTokenHash, reset.id]
        );

        await client.query("COMMIT");

        // Send reset permission in an HTTP-only cookie
        res.cookie("passwordResetToken", resetToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
            path: "/api/auth/reset-password"
        });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password."
        });

    } catch (error) {
        if (client) {
            await client.query("ROLLBACK").catch(() => {});
        }

        console.error("OTP verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify OTP"
        });

    } finally {
        if (client) {
            client.release();
        }
    }
});



// RESET USER PASSWORD
router.post("/reset-password", async (req, res) => {
    let client;

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/api/auth/reset-password"
    };

    try {
        const { password, confirmPassword } = req.body;
        const resetToken = req.cookies?.passwordResetToken;

        // Validate reset permission
        if (!resetToken) {
            return res.status(401).json({
                success: false,
                message: "Password reset session missing. Verify your OTP again."
            });
        }

        // Validate password
        if (
            typeof password !== "string" ||
            Buffer.byteLength(password, "utf8") < 8 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 and 72 bytes."
            });
        }

        if (
            typeof confirmPassword !== "string" ||
            password !== confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        // Hash the temporary reset token
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        client = await pool.connect();

        await client.query("BEGIN");

        // Find and lock the valid reset permission
        const result = await client.query(
            `SELECT id, user_id
             FROM password_reset_otps
             WHERE reset_token_hash = $1
               AND verified_at IS NOT NULL
               AND reset_token_expires_at > NOW()
               AND consumed_at IS NULL
             ORDER BY created_at DESC
             LIMIT 1
             FOR UPDATE`,
            [resetTokenHash]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");

            res.clearCookie("passwordResetToken", cookieOptions);

            return res.status(401).json({
                success: false,
                message: "Password reset permission has expired or is invalid. Verify your OTP again."
            });
        }

        const resetRequest = result.rows[0];

        // Hash the new password
        const passwordHash = await bcrypt.hash(password, 12);

        // Update the user's password in Neon
        const updateResult = await client.query(
            `UPDATE users
             SET password_hash = $1
             WHERE id = $2`,
            [passwordHash, resetRequest.user_id]
        );

        if (updateResult.rowCount !== 1) {
            throw new Error("User account could not be updated");
        }

        // Invalidate every outstanding reset request for this user
        await client.query(
            `UPDATE password_reset_otps
             SET consumed_at = NOW(),
                 reset_token_hash = NULL,
                 reset_token_expires_at = NULL
             WHERE user_id = $1
               AND consumed_at IS NULL`,
            [resetRequest.user_id]
        );

        await client.query("COMMIT");

        // Remove temporary reset permission
        res.clearCookie("passwordResetToken", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please sign in with your new password."
        });

    } catch (error) {
        if (client) {
            await client.query("ROLLBACK").catch(() => {});
        }

        console.error("Password reset error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password. Please try again."
        });

    } finally {
        if (client) {
            client.release();
        }
    }
});


module.exports = router;
