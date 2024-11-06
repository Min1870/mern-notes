import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date().getTime(),
  },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
