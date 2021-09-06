const User = require("../model/user.model");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

exports.createUser = (async (req,res) =>{

    try {
    
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), 
      password: encryptedPassword,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
})

exports.loginUser = (async (req,res) =>{
    
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        
        user.token = token;
  
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    
  });

exports.loginSuccess = ((req,res) =>{
    res.status(200).send("Welcome 🙌 ");
})

exports.viewUser = ((req,res) =>{
    var userId = req.query.id;
    User.findById(userId,(err,data) =>{
      console.log(data);
        if(err){
            res.send(err)
        }
        else{
            if(data){
                res.send(data)
            }else{
                res.send({Message : 'No User Found'})
            }
        }
    })
})

exports.updateUser = ((req,res) =>{
  try{
      var userId = req.query.id;
      var updateUser = req.body
      User.findByIdAndUpdate(userId,updateUser,(err,isExist) =>{
        if(isExist){
          res.status(200).send({Message : 'User Updated Sucessfully'})
        }else{
          res.status(201).send({Message : 'User Not Found'})
        }
      })
    }
    catch(err){
      res.status(400).send(err);
    }
})

exports.deleteUser = ((req,res) =>{
    var userId = req.query.id;
    User.findByIdAndRemove({_id: userId}, (err, data) => {
        if (err) {
          console.log(err);
            res.status(201).send("User Not Found")
        }else{
          res.status(200).send("User Deleted Sucessfully")
        }
      });
})