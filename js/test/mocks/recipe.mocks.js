"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSomeRecipes = exports.deleteAllRecipes = exports.recipes = void 0;
const server_config_1 = require("../config/server.config");
const title = server_config_1.faker.lorem.sentence();
const description = server_config_1.faker.lorem.sentences(3);
const preparing = [
    server_config_1.faker.lorem.sentence(),
    server_config_1.faker.lorem.sentence(),
    server_config_1.faker.lorem.sentence(),
    server_config_1.faker.lorem.sentence(),
];
const ingredients = [
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
    [server_config_1.faker.lorem.word(), server_config_1.faker.lorem.word()],
];
const image = "/this/will/be.changed";
const recipe = {
    title: title + "1",
    description,
    preparing,
    ingredients,
    image,
};
const recipeTitleEmpty = {
    description,
    preparing,
    ingredients,
    image,
};
const recipeTitleNotString = {
    title: 1,
    description,
    preparing,
    ingredients,
    image,
};
const recipeTitleTooShort = {
    title: "Ab",
    description,
    preparing,
    ingredients,
    image,
};
const recipeTitleTooLong = {
    title: server_config_1.faker.lorem.sentences(20),
    description,
    preparing,
    ingredients,
    image,
};
const recipeDescriptionEmpty = {
    title,
    preparing,
    ingredients,
    image,
};
const recipeDescriptionNotString = {
    title,
    description: ["faker.lorem.sentences(50)"],
    preparing,
    ingredients,
    image,
};
const recipeDescriptionTooLong = {
    title,
    description: server_config_1.faker.lorem.sentences(50),
    preparing,
    ingredients,
    image,
};
const recipePreparingEmpty = {
    title,
    description,
    ingredients,
    image,
};
const recipePreparingNotArray = {
    title,
    description,
    preparing: "Just do it.",
    ingredients,
    image,
};
const recipePreparingContentNotString = {
    title,
    description,
    preparing: [1, "3", { haha: true }, false],
    ingredients,
    image,
};
const recipePreparingContentEmpty = {
    title,
    description,
    preparing: [],
    ingredients,
    image,
};
const recipeIngredientsEmpty = {
    title,
    description,
    preparing,
    image,
};
const recipeIngredients1NotArray = {
    title,
    description,
    preparing,
    ingredients: "just not array.",
    image,
};
const recipeIngredients2NotArray = {
    title,
    description,
    preparing,
    ingredients: [1, 22, "asd"],
    image,
};
const recipeIngredientsContentEmpty = {
    title,
    description,
    preparing,
    ingredients: [[], [], [], ["1tsb", "sugar"]],
    image,
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
    image,
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
exports.recipes = recipes;
const deleteAllRecipes = function () {
    return server_config_1.Recipe.deleteMany();
};
exports.deleteAllRecipes = deleteAllRecipes;
const addSomeRecipes = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipe1 = new server_config_1.Recipe(Object.assign(Object.assign({}, recipe), { userId }));
        const recipe2 = new server_config_1.Recipe(Object.assign(Object.assign({}, recipeDescriptionEmpty), { userId }));
        const recipeForId = yield recipe1.save();
        yield recipe2.save();
        return recipeForId._id;
    });
};
exports.addSomeRecipes = addSomeRecipes;
