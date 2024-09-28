import jwt from 'jsonwebtoken';
import con from '../utils/mysqlDb.js';
const isAdmin=async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        res.send({message:"Signup and login please."})
    }else{

        const userId = await jwt.verify(token,process.env.JWT_SECRET);
        
        const q = `SELECT * FROM user WHERE id = ?`
        con.query(q,[userId.id],(err,result)=>{
            if(err){
                res.status(500).json({message:"something went wrong."})
            };
            if(result[0].role == "admin"){
                next()
            }else{
                res.send({message:"you are not authorised."});
            }
            
        })
    }
}

const isSameAdmin = async (req, res, next) => {
    const {id} = req.body;
    console.log("=>",id);
    if (!id || id === "") {
        return res.status(400).send({ message: "Who wants to delete?" });
    }

    // Assuming you have the token available to decode userId
    const token = req.cookies.token;
    console.log("token=>",token);
    let userId;

    try {
        userId = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const q = `SELECT * FROM user WHERE id = ?`;
    con.query(q, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Something went wrong." });
        }

        if (!result.length) {
            return res.status(404).json({ message: "User not found." });
        }

        if (result[0].id === userId.id) {
            return res.status(403).json({
                message: "You cannot delete yourself."
            });
        } 

        // Proceed if the user is different 
        next();
    });
};


export {isAdmin,isSameAdmin}