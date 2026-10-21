import { Schema, model, Types } from "mongoose";

export const ENROLLMENT_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "suspended",
  "completed",
] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export interface IEnrollment {
  student_id: Types.ObjectId | string;
  course_id: Types.ObjectId | string;
  absence_count: number;
  accepted_at: Date;
  accepted_by?: Types.ObjectId | string;
  status: EnrollmentStatus;
  id?: string;
  _id?: any;
  __v?: number;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    absence_count: { type: Number, default: 0 },
    accepted_at: { type: Date, default: Date.now },
    accepted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ENROLLMENT_STATUSES,
      default: "pending",
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
  },
);

enrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });

enrollmentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const EnrollmentModel = model<IEnrollment>(
  "Enrollment",
  enrollmentSchema,
);
