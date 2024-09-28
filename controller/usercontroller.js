import bcrypt from "bcryptjs";
import con from "../utils/mysqlDb.js";
import cookieParser from "cookie-parser";

const registerController = async (req, res) => {
    console.log("req.body is=.",req.body)
    const { name, email, password, role } = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !password ) {
            return res.status(400).send("All fields are required");
        }

        // Hash the password asynchronously
        const hash = await bcrypt.hash(password, 10);

        // Prepare the SQL query
        let query;
        let data;
        if(!role || role == ""){

            query = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
            data =[name,email,hash];
        }else{

            query = `INSERT INTO user (name, email, password,role) VALUES (?, ?, ?,?)`;
            data =[name,email,hash,role];
        }

        // Execute the query
        con.query(query, data, (error, result) => {
            if (error) {
                console.error("Error while inserting user into database:", error);

                // Ensure that the response is only sent once
                if (!res.headersSent) {
                    return res.status(500).send("Database error: " + error.message);
                }
            } else {
                // Send success response only if no error
                if (!res.headersSent) {
                    return res.status(201).send({message:"User registered successfully",success:true,});
                }
            }
        });

    } catch (error) {
        console.error("Error during registration:", error);

        // Catch block to handle unexpected errors
        if (!res.headersSent) {
            return res.status(500).send("Server error during registration");
        }
    }
};

const loginController=(req,res)=>{
    res.send("login controller")
}
const userLogout = (req, res) => {
    res.clearCookie("token");  // Clear the token cookie
    res.status(200).json({ message: "User logged out successfully." });  // Return a success message with status 200
};



export {registerController,loginController,userLogout}