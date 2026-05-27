import AuthService from "../../services/auth.service.js";

const register = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export {register, verifyEmail};
