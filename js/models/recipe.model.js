"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    preparing: [{ type: String, required: true }],
    ingredients: [[{ type: String, required: true }]],
    userId: { type: String, required: true },
});
exports.Recipe = mongoose_1.model("recipe", recipeSchema);
