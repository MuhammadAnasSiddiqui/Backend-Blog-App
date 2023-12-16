const express = require("express");
const upload = require("../utils/multer.js");
const authMiddleWare = require("../middleWares/index.js");
const router = express.Router();

//Blog Controllers
const { createBlogController, userBlogsController, getAllBlogsController, uploadDpController, updateBlogController, deleteBlogController, userDetailsController, } = require("../controllers/postsControllers.js");

//Auth Controllers
const { signupController, loginController, updateProfileController } = require("../controllers/authsControllers.js");

// Auth Routes
router.post("/api/signup", signupController);
router.post("/api/login", loginController);

// Blog Routes
router.post("/api/createblog", [authMiddleWare], createBlogController);
router.get("/api/userblogs/:id", [authMiddleWare], userBlogsController);
router.get("/api/userDetails/:id", userDetailsController);
router.get("/api/getallblogs", getAllBlogsController);
router.put("/api/updateblog/:id", [authMiddleWare], updateBlogController);
router.delete("/api/deleteblog/:id", [authMiddleWare], deleteBlogController);

// profile Routes
router.post("/api/profilephoto/:id", [authMiddleWare], upload.any("image"), uploadDpController);
router.put('/api/updateprofile/:id', [authMiddleWare], updateProfileController);

module.exports = router;