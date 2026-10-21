import { Schema, model, Types } from "mongoose";

export const COURSE_STATUSES = ["active", "draft", "completed"] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export interface ICourse {
  title: string;
  teacher: Types.ObjectId | string;
  duration_hours: number;
  status: CourseStatus;
  image:string;
  id?: string;
  _id?: any;
  __v?: number;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration_hours: { type: Number, required: true, min: 1 },
    image: { type: String, required: false, min: 1 },
    status: {
      type: String,
      enum: COURSE_STATUSES,
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

courseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const CourseModel = model<ICourse>("Course", courseSchema);