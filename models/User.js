const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username."],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email address."],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password."],
        },
        avatar: {
            type: String,
            default: "https://media1.thehungryjpeg.com/thumbs2/ori_3575495_sdh07h7s5xnio2oxxakc7ign0f02gwn1so47qnrv_pencil-icon.jpg",
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;