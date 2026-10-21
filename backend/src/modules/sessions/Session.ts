import { Schema, model, Types } from "mongoose";

export interface ISession {
  course: Types.ObjectId | string;
  content: string;
  session_date: Date;
  id?: string;
  _id?: any;
  __v?: number;
}

const sessionSchema = new Schema<ISession>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    content: { type: String, required: true },
    session_date: { type: Date, required: true },
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

sessionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const SessionModel = model<ISession>("Session", sessionSchema);