"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
});
exports.User = mongoose_1.model("user", userSchema);
