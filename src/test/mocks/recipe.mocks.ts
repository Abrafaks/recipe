import { faker, Recipe } from "../config/server.config";

const title = faker.lorem.sentence();
const description = faker.lorem.sentences(3);
const preparing = [
  faker.lorem.sentence(),
  faker.lorem.sentence(),
  faker.lorem.sentence(),
  faker.lorem.sentence(),
];
const ingredients = [
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
];
const url = "/this/will/be.changed";

const recipe = {
  title: title + "1",
  description,
  preparing,
  ingredients,
  url,
};

const recipeTitleEmpty = {
  description,
  preparing,
  ingredients,
  url,
};

const recipeTitleNotString = {
  title: 1,
  description,
  preparing,
  ingredients,
  url,
};

const recipeTitleTooShort = {
  title: "Ab",
  description,
  preparing,
  ingredients,
  url,
};

const recipeTitleTooLong = {
  title: faker.lorem.sentences(20),
  description,
  preparing,
  ingredients,
  url,
};

const recipeDescriptionEmpty = {
  title,
  preparing,
  ingredients,
  url,
};

const recipeDescriptionNotString = {
  title,
  description: ["faker.lorem.sentences(50)"],
  preparing,
  ingredients,
  url,
};

const recipeDescriptionTooLong = {
  title,
  description: faker.lorem.sentences(50),
  preparing,
  ingredients,
  url,
};

const recipePreparingEmpty = {
  title,
  description,
  ingredients,
  url,
};

const recipePreparingNotArray = {
  title,
  description,
  preparing: "Just do it.",
  ingredients,
  url,
};

const recipePreparingContentNotString = {
  title,
  description,
  preparing: [1, "3", { haha: true }, false],
  ingredients,
  url,
};

const recipePreparingContentEmpty = {
  title,
  description,
  preparing: [],
  ingredients,
  url,
};

const recipeIngredientsEmpty = {
  title,
  description,
  preparing,
  url,
};

const recipeIngredients1NotArray = {
  title,
  description,
  preparing,
  ingredients: "just not array.",
  url,
};

const recipeIngredients2NotArray = {
  title,
  description,
  preparing,
  ingredients: [1, 22, "asd"],
  url,
};

const recipeIngredientsContentEmpty = {
  title,
  description,
  preparing,
  ingredients: [[], [], [], ["1tsb", "sugar"]],
  url,
};

const recipeIngredientsContentNotString = {
  title,
  description,
  preparing,
  ingredients: [
    ["3", 2],
    [{ haha: true }, "xd"],
    [true, false],
    [1, 2],
  ],
  url,
};

const recipes = {
  recipe,
  recipeTitleEmpty,
  recipeTitleNotString,
  recipeTitleTooShort,
  recipeTitleTooLong,
  recipeDescriptionEmpty,
  recipeDescriptionNotString,
  recipeDescriptionTooLong,
  recipePreparingEmpty,
  recipePreparingNotArray,
  recipePreparingContentNotString,
  recipePreparingContentEmpty,
  recipeIngredientsEmpty,
  recipeIngredients1NotArray,
  recipeIngredients2NotArray,
  recipeIngredientsContentEmpty,
  recipeIngredientsContentNotString,
};

const deleteAllRecipes = function () {
  return Recipe.deleteMany();
};

const addSomeRecipes = async function () {
  const recipe1 = new Recipe({ ...recipe, userId: "60ec225655915ba21f1638e2" });
  const recipe2 = new Recipe({
    ...recipeDescriptionEmpty,
    userId: "60ec225655915ba21f1638e2",
  });

  const recipeForId = await recipe1.save();
  await recipe2.save();
  return recipeForId._id;
};

export { recipes, deleteAllRecipes, addSomeRecipes };
