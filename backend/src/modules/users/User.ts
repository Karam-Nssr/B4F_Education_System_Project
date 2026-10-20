import { Schema, model } from "mongoose";

export const USER_ROLES = ["admin", "teacher", "student"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser {
  first_name: string;
  last_name: string;
  phone_number: number;
  email: string;
  password?: string;
  role: UserRole;
  tokenVersion?: number;
  id?: string;
  _id?: any;               
  __v?: number;
}

const userSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
    },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.tokenVersion;
      },
    },
  }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const UserModel = model<IUser>("User", userSchema);