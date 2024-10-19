const User = require('../models/user');
const cloudinary = require('cloudinary').v2; 

exports.registerUser = async (req, res, next) => {
    console.log(req.body)
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    }, (err, res) => {
        console.log(err, res);
    });
    console.log(result)
    const { name, email, contactNumber, address, password,  } = req.body;
    const user = await User.create({
        name,
        email,
        contactNumber,
        address,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        },
    })
    
     const token = user.getJwtToken();

    return  res.status(201).json({
      	success:true,
      	user,
     	token
    })
    // sendToken(user, 200, res)
}