import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
      minlength: 6,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "TENANT_ADMIN", "AGENT", "CUSTOMER"],
      default: "CUSTOMER",
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },
  },
  { timestamps: true }
);

/* INDEXES */
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ tenant: 1, role: 1 });

/* HASH PASSWORD ONLY IF PRESENT */
userSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* SAFE PASSWORD COMPARE */
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;