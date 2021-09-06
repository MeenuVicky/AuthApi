const auth = require("../middleware/auth.middleware");
var userController = require("../controller/user.controller");

module.exports = ((app) =>{
    app.post("/createUser", userController.createUser)
    app.get("/viewUser", auth,userController.viewUser)
    app.put("/updateUser", auth,userController.updateUser)
    app.delete("/deleteUser", auth,userController.deleteUser)
    app.post("/login", userController.loginUser)
    app.post("/welcome", auth, userController.loginSuccess)
})