if (process.env.NOSW_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ppr = require("./models/ppr.js");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const axios = require("axios");
const port = process.env.PORT || 8080;
// const dbUrl = "mongodb://127.0.0.1:27017/samplePpr"
const dbUrl = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connected to data base");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const sessionOption = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("root is working");
});
app.get("/home", (req, res) => {
  res.render("./ppr/home.ejs");
});

app.post(
  "/search",
  wrapAsync(async (req, res) => {
    let sub = req.body.sub.toLowerCase(); // Convert input to lowercase
    let pr = await ppr.find({ subName: { $regex: sub, $options: 'i' } }); // Case-insensitive search
    res.render("./ppr/show.ejs", { pr });
  })
);

// Route to handle search requests
app.get("/ml-search", async (req, res) => {
  try {
    const query = req.query.query; // Get query parameter from the request

    if (!query) {
      return res.render("error.ejs", { err: "Query parameter is required." });
    }

    // Send GET request to the Flask API
    // const response = await axios.get("http://127.0.0.1:8000/search", {
    //     params: { query },
    // });

    const response = await axios.get(
      "https://peaceful-tamma-udayjit-98aff569.koyeb.app/search",
      {
        params: { query },
      }
    );

    // Extract data from Flask response
    const { results, total_results } = response.data;

    // Render results to the EJS page
    res.render("./ppr/mlResultPage.ejs", {
      result: results,
      total: total_results,
      query,
    });
  } catch (error) {
    console.error("Error connecting to the Python server:", error.message);
    res.render("error.ejs", {
      err: "Unable to fetch results from the Python server.",
    });
  }
});

app.get("/new", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to add a Paper");
    return res.redirect("/login");
  }
  res.render("./ppr/new.ejs");
});

app.post(
  "/add",
  wrapAsync(async (req, res) => {
    if (!req.body.ppr) {
      throw new ExpressError(400, "Send valid data to add Paper");
    }
    const newPpr = new ppr(req.body.ppr);
    await newPpr.save();
    req.flash("success", "Paper is added Sucessfully!");
    res.redirect("/ppr");
  })
);

app.get(
  "/ppr",
  wrapAsync(async (req, res) => {
    const course = await ppr.distinct("course");
    res.render("./ppr/course.ejs", { course });
  })
);

app.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome back to VYUGen Papers");
    res.redirect("/new");
  }
);

app.get(
  "/:cr",
  wrapAsync(async (req, res) => {
    let { cr } = req.params;
    const branch = await ppr.distinct("branch", { course: cr });
    res.render("./ppr/branch.ejs", { branch, cr });
  })
);

app.get(
  "/:cr/:br",
  wrapAsync(async (req, res) => {
    let { cr } = req.params;
    let { br } = req.params;
    const sem = await ppr.distinct("semester", { branch: br, course: cr });
    res.render("./ppr/sem.ejs", { sem, br, cr });
  })
);

app.get(
  "/:cr/:br/:sm",
  wrapAsync(async (req, res) => {
    let { cr } = req.params;
    let { br } = req.params;
    let { sm } = req.params;
    const subs = await ppr.distinct("subName", {
      semester: sm,
      branch: br,
      course: cr,
    });
    res.render("./ppr/sub.ejs", { subs, sm, br, cr });
  })
);

app.get(
  "/:cr/:br/:sm/:sb",
  wrapAsync(async (req, res) => {
    let { cr } = req.params;
    let { sm } = req.params;
    let { br } = req.params;
    let { sb } = req.params;
    let pr = await ppr.find({
      subName: sb,
      branch: br,
      semester: sm,
      course: cr,
    });
    res.render("./ppr/show.ejs", { pr });
  })
);

//if not created page is requested
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page Not Found!"));
});

//expreserr
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SOMETHING WENT WRONG!" } = err;
  res.render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


