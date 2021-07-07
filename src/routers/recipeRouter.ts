import express from "express";
import { Request } from "express";
import Recipe from "../models/recipeModel";
import auth from "../middleware/auth";

let router = express.Router();

router.post("/create", auth, async (req, res) => {
  try {
    const { title, description, preparing, ingredients, url } = req.body;

    if (!title || !description || !preparing || !ingredients || !url)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required data." });

    const newRecipe = new Recipe({
      title,
      description,
      preparing,
      ingredients,
      user: req.user,
      url,
    });

    const savedRecipe = await newRecipe.save();

    res.json(savedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// reading recipes - if user is admin, then he sees all,
// else user sees only recipes created by him

// skip: number of items to skip, limit: how much to show
router.post("/read", auth, async (req, res) => {
  try {
    const { user, admin } = req;
    const { skip, limit } = req.body;

    if (admin) {
      Recipe.find({}, null, { skip, limit }, (err, result) => {
        if (err) console.log(err);
        else res.send(result);
      });
    } else {
      Recipe.find({ user }, null, { skip, limit }, (err, result) => {
        if (err) console.log(err);
        else res.send(result);
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// reading recipe by id
router.get("/readbyid", auth, async (req, res) => {
  try {
    const { id } = req.body;

    const recipes = await Recipe.find({ _id: id });
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// update recipe by id
router.post("/update", auth, async (req, res) => {
  try {
    const { title, description, preparing, ingredients, url, id } = req.body;
    const { user, admin } = req;

    if (admin) {
      const result = await Recipe.updateOne(
        { _id: id },
        { title, description, preparing, ingredients, url }
      );
      console.log(result);
      console.log(id);
      if (result.nModified === 1) return res.status(200).send("success");
    } else {
      const result = await Recipe.updateOne(
        { _id: id, user },
        { title, description, preparing, ingredients, url }
      );

      if (result.nModified === 1) return res.status(200).send("success");
    }
    // recepe doesn't belong to user or he sent the same copy and it wasn't modified
    return res.status(400).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// find recipe by exact name (title)
router.post("/readbyname", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const recipes = await Recipe.find({
      title: new RegExp("^" + name + "$", "i"),
    });
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
