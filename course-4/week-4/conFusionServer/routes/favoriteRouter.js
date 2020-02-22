const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Favorites = require("../models/favorites");

var authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user dishes")
      .then(
        favorites => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then(favorite => {
      if (!favorite) {
        let newFavorite = new Object({
          user: req.user._id,
          dishes: [req.params.dishId]
        });
        Favorites.create(newFavorite)
          .then(
            newFavorite => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(newFavorite);
            },
            err => next(err)
          )
          .catch(err => next(err));
      } else if (favorite) {
        if (favorite.dishes.indexOf(req.params.dishId) == -1) {
          favorite.dishes.push(req.params.dishId);
          favorite
            .save()
            .then(
              updatedFavorite => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(updatedFavorite);
              },
              err => next(err)
            )
            .catch(err => next(err));
        } else {
          let err = new Error(
            "This dish is already added to your favorite list, operation aborted"
          );
          err.status = 403;
          return next(err);
        }
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then(favorite => {
      let index = favorite.dishes.indexOf(req.params.dishId);
      if (index != -1) {
        favorite.dishes.splice(index, 1);
        favorite
          .save()
          .then(
            updatedFavorite => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(updatedFavorite);
            },
            err => next(err)
          )
          .catch(err => next(err));
      } else {
        let err = new Error(
          "Selected dish is not your favorite dish, request aborted"
        );
        err.status = 403;
        return next(err);
      }
    });
  });

module.exports = favoriteRouter;
