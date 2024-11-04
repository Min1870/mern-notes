import { Schema, model, InferSchemaType } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

type Note = InferSchemaType<typeof noteSchema>;

const Notes = model<Note>("Note", noteSchema);

export default Notes;
