const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const empSchema = new Schema(
  {
    empPerms: {
      type: [String],
      validate: {
        validator: function (v) {
          const empType = this.empType;
          let maxPerms;

          if (empType === "superAdmin") {
            maxPerms = 10;
          } else if (empType === "dev") {
            maxPerms = 7;
          } else if (empType === "jrdev") {
            maxPerms = 5;
          } else if (empType === "intern") {
            maxPerms = 3;
          } else maxPerms = 0;

          return v.length <= maxPerms;
        },
        message: (props) =>
          //   props.value.length,
          //   // props,
          // // `The ${props.instance.empType} permissions array must have a maximum of ${props.value.length} items.`,
          `More permissions are assigned then required`,
      },
      required: true,
    },
    empType: {
      type: String,
      required: true,
      enum: ["superAdmin", "dev", "jrdev", "intern"],
    },
    empUsername: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

empSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      empType: this.empType,
      empUsername: this.empUsername,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

empSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

empSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

empSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Employee = mongoose.model("Employees", empSchema);

module.exports = { Employee };
