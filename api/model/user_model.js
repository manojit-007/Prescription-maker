const mongoose = require("mongoose");
const argon2 = require("argon2");
const crypto = require("crypto");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, 
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, 
    },

    passwordResetToken: {
      type: String,
      default: null,
      index: true,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await argon2.hash(this.password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
});

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

userSchema.methods.verifyPassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("Password not selected. Use .select('+password')");
  }
  return argon2.verify(this.password, candidatePassword);
};

userSchema.methods.generatePasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  return rawToken;
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

userSchema.index({ email: 1, isEmailVerified: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;