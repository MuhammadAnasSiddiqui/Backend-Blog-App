const postModel = require("../model/postSchema");
const userModel = require("../model/userSchema");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const createBlogController = async (req, res) => {
    try {
        const { blogTitle, blogDesc, userId } = req.body;
        const objToSend = {
            blog_title: blogTitle,
            blog_desc: blogDesc,
            user_id: userId
        }

        const postData = await postModel.create(objToSend);

        let user = await userModel.findOne({ _id: userId });
        user.posts.push(postData._id);
        await user.save()
        res.json({
            message: "create blog",
            status: true,
            data: postData
        })
    } catch (error) {
        res.json({
            message: error.message,
            status: false,
            data: null
        })
    }

}

const userBlogsController = async (req, res) => {
    try {
        const { id } = req.params
        const userBlogs = await userModel.findOne({ _id: id })
            .populate("posts")
        res.json({
            message: "get user Blogs",
            status: true,
            data: userBlogs
        })
    } catch (error) {
        res.json({
            message: error.message,
            status: false,
            data: null
        })
    }

}

const userDetailsController = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
            .populate("posts")
        if (!user) {
            return res.json({
                message: 'User not found',
                status: false,
                data: null
            })
        }

        res.json({
            message: "get user details",
            status: true,
            data: user
        })
    } catch (error) {
        res.json({
            message: error.message,
            status: false,
            data: null
        })
    }
}

const getAllBlogsController = async (req, res) => {
    try {
        const getAllBlogs = await postModel.find({}).populate('user_id');
        console.log("getAllBlogs--->", getAllBlogs);
        if (!getAllBlogs) {
            return res.json({
                message: "Users not found",
                status: false,
                data: null
            })
        }
        res.json({
            message: "Get all blogs",
            status: true,
            data: getAllBlogs
        })

    } catch (error) {
        res.json({
            message: error.message,
            status: false,
            data: null
        })

    }

}

const updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { blogTitle, blogDesc } = req.body;

        const objToSend = {
            blog_title: blogTitle,
            blog_desc: blogDesc
        }

        const updatedBlog = await postModel.findByIdAndUpdate(id, objToSend);

        if (!updatedBlog) {
            return res.json({
                message: "user not found",
                status: false,
                data: null
            })
        }

        res.json({
            message: "Updated blog successfully",
            status: true,
            data: updatedBlog
        })

    } catch (err) {
        console.log("err----", err);
        res.json({
            message: err.message,
            status: false,
            data: null
        })

    }
}

const deleteBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteBlog = await postModel.findByIdAndDelete(id);
        res.json({
            message: "Deleted blog successfully",
            status: true,
        })

    } catch (err) {
        console.log("err----", err);
        res.json({
            message: err.message,
            status: false,
            data: null
        })

    }
}

// update user get
const uploadDpController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.files || req.files.length === 0) {
            return res.json({
                message: "No file uploaded",
                status: false,
                data: null
            });
        }

        const path = req.files[0].path;
        const user = await userModel.findById(id);

        cloudinary.uploader.upload(path, async (error, data) => {
            if (error) {
                console.error('Error uploading to Cloudinary:', error);
                return res.json({
                    message: "Could not upload image to cloud, try again",
                    status: false,
                    data: null
                });
            }
            if (!data) {
                return res.json({
                    message: "Could not upload image, try again",
                    status: false,
                    data: null
                });
            }
            user.dp = data.secure_url;

            // Save the updated user
            const upload = await user.save();
            // Delete the local file after successful upload
            fs.unlinkSync(path);
            res.json({
                message: "Image uploaded successfully",
                data: upload,
                status: true
            });
        });
    } catch (error) {
        console.error("Internal server error:", error.message);
        res.json({
            message: error.message,
            status: false,
            data: null
        });
    }
};


module.exports = {
    createBlogController,
    userBlogsController,
    userDetailsController,
    getAllBlogsController,
    updateBlogController,
    deleteBlogController,
    uploadDpController,
}
