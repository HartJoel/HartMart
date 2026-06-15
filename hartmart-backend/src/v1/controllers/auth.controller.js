import AuthService from "../../services/auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { setAuthCookies } from "../../utils/generate.token.js";

const register = asyncHandler(async (req, res) => {
  const { user } = await AuthService.register(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        emailVerificationToken: user.emailVerificationToken,
      },
    },
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Verification token is required",
    });
  }
  const result = await AuthService.verifyEmail(token);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  // Set cookies in response
  setAuthCookies(res, accessToken, refreshToken);

  // Return user data (consistent with register response)
  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  return res.status(200).json({
    success: true,
    message: result.message,
    token: result.passwordResetToken,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  const result = await AuthService.resetPassword(token, password);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

export { register, verifyEmail, login, forgotPassword, resetPassword };
