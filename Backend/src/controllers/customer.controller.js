import mongoose from "mongoose";
import Ticket from "../models/ticket.model.js";

export const listCustomers = async (req, res) => {
  try {
    const customers = await Ticket.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(req.user.tenant),
        },
      },

      {
        $group: {
          _id: "$customer",

          totalTickets: { $sum: 1 },

          openTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", "open"] }, 1, 0],
            },
          },

          lastActive: { $max: "$createdAt" },

          priorities: { $push: "$priority" },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },

      {
        $unwind: "$customer",
      },

      {
        $project: {
          _id: "$customer._id",
          username: "$customer.username",
          email: "$customer.email",
          createdAt: "$customer.createdAt",

          totalTickets: 1,
          openTickets: 1,
          lastActive: 1,

          highestPriority: {
            $cond: [
              { $in: ["Critical", "$priorities"] },
              "Critical",
              {
                $cond: [
                  { $in: ["High", "$priorities"] },
                  "High",
                  {
                    $cond: [
                      { $in: ["Medium", "$priorities"] },
                      "Medium",
                      "Low",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      {
        $sort: {
          lastActive: -1,
        },
      },
    ]);

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