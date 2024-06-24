import { Schema } from "mongoose";
import User from "./user.model";
import { IMentor } from "../../interfaces";
import mongooseAutoPopulate from "mongoose-autopopulate";
import MentorshipGroup from "../groups/mentorship.group.model";
import { capitalizeString } from "../../utils";

const mentorSchema = new Schema<IMentor>({
  role: {
    type: String,
    enum: ["mentor"],
    default: "mentor",
  },
  track: {
    type: String,
    enum: ["product design", "backend", "frontend", "web3"],
    required: true,
  },
  group_info: {
    type: Schema.Types.ObjectId,
    ref: "Mentorship Group",
    autopopulate: { select: " -createdAt -updatedAt -__v -deleted " },
  },
  permissions: {
    type: [String],
    enum: ["facilitate", "mark"],
    default: [],
  },
});

mentorSchema.plugin(mongooseAutoPopulate);

mentorSchema.pre("save", async function (next) {
  if (this.isNew && this.role === "mentor") {
    await MentorshipGroup.create({
      name: `${capitalizeString(this.fullName)}'s Mentorship Group`,
      mentor: this._id
    });
  }
  next();
});

export default User.discriminator<IMentor>("Mentor", mentorSchema);