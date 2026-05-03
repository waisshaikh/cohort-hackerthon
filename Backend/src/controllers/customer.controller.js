import userModel from "../models/user.model.js";

export const listCustomers = async (req, res) => {
  try {
    const customers = await userModel.find({
      tenant: req.user.tenant,
      role: "CUSTOMER",
    })
    .select("username email createdAt")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("List customers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};