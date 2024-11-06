import { Schema, model, InferSchemaType } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: new Date().getTime(),
    },
  },
  { timestamps: true }
);

type Note = InferSchemaType<typeof noteSchema>;

const Notes = model<Note>("Note", noteSchema);

export default Notes;
