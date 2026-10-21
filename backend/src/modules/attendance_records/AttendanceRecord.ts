import { Schema, model, Types } from "mongoose";

export const ATTENDANCE_STATUSES = [
  "present",
  "excused_absence",
  "unexcused_absence",
  "late",
] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface IAttendanceRecord {
  session_id: Types.ObjectId | string;
  student_id: Types.ObjectId | string;
  status: AttendanceStatus;
  notes?: string;
  checked_at: Date;
  id?: string;
  _id?: any;
  __v?: number;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    session_id: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ATTENDANCE_STATUSES,
      required: true,
      default: "unexcused_absence",
    },
    notes: { type: String, trim: true },
    checked_at: { type: Date, default: Date.now },
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

attendanceRecordSchema.index({ session_id: 1, student_id: 1 }, { unique: true });

attendanceRecordSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const AttendanceRecordModel = model<IAttendanceRecord>(
  "AttendanceRecord",
  attendanceRecordSchema
);