const userModel = require("../model/userSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// signup controller
const signupController = async (req, res) => {
    try {
        const { fullName, email, password, repPassword } = req.body;
        if (!fullName,
            !email,
            !password,
            !repPassword) {
            res.json({
                message: "required fields are missing",
                status: false,
                data: null
            })
            return
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const hashRepPassword = await bcrypt.hash(repPassword, 10)
        const objToSend = {
            full_name: fullName,
            email,
            password: hashPassword,
            rep_password: hashRepPassword
        }

        const isEmailExist = await userModel.findOne({ email });
        console.log("isEmailExist", isEmailExist);

        if (isEmailExist) {
            res.json({
                message: "this email address has been already exist",
                status: false,
                data: null
            })
            return
        }

        if (password !== repPassword) {
            res.json({
                message: "password does not matched",
                status: false,
                data: null
            })
            return
        }

        const userSignup = await userModel.create(objToSend);
        res.json({
            message: "user successfully signup",
            status: true,
            data: userSignup
        })
    } catch (err) {
        console.log("err---->", err);
        res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

// login controller
const loginController = async (req, res) => {
    const { email, password } = req.body;
    const isEmailExist = await userModel.findOne({ email });

    if (!isEmailExist) {
        res.json({
            message: "Invalid Credential ",
            status: false,
            data: null
        })
        return
    };
    const comparePassword = await bcrypt.compare(password, isEmailExist.password);

    if (comparePassword) {
        var token = jwt.sign({ email: isEmailExist.email }, 'PRIVATEKEY');
        console.log("token----->", token)
        res.json({
            message: "user successfully login",
            status: true,
            data: isEmailExist,
            token,
        })
        return
    }
    else {
        res.json({
            message: "Invalid Credential ",
            status: false,
            data: null
        })
    }
}

// update profile controller
const updateProfileController = async (req, res) => {
    try {
        const { editName, oldPassword, newPassword, repPassword } = req.body;
        const id = req.params.id;

        // Check if new_password and rep_password match
        if (newPassword !== repPassword) {
            return res.json({
                message: 'New password and repeat password do not match',
                status: false,
                data: null
            });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.json({
                message: 'User not found',
                status: false,
                data: null
            });
        }

        // If old_password is provided, update the password
        if (oldPassword) {
            const comparePassword = await bcrypt.compare(oldPassword, user.password);

            if (!comparePassword) {
                return res.json({
                    message: 'Invalid old password',
                    status: false,
                    data: null
                });
            }

            const hashPassword = await bcrypt.hash(newPassword, 10);
            const hashRepPassword = await bcrypt.hash(repPassword, 10);

            // Update the password
            user.password = hashPassword;
            user.rep_password = hashRepPassword;
        }

        // If full_name is provided, update the name
        if (editName) {
            user.full_name = editName;
        }

        // Save the updated user
        const updatedUser = await user.save();

        res.json({
            message: 'Profile updated successfully',
            status: true,
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Internal Server Error',
            status: false,
            data: null
        });
    }
}


module.exports = { signupController, loginController, updateProfileController }