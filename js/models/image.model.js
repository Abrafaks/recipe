"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    recipeId: { type: String, required: true },
    image: { type: Buffer, required: true },
});
exports.Image = mongoose_1.model("image", imageSchema);
