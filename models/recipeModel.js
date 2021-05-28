const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  preparing: [{ type: String, required: true }],
  ingredients: [{ type: String, required: true }],
});

const Recipe = mongoose.model("recipe", recipeSchema);

module.exports = Recipe;
