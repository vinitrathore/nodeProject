import con from "../utils/mysqlDb.js";

const alluser = (req, res) => {
    const q = `SELECT * FROM user`;
  
    con.query(q, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Server error while fetching users" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        users: results,
      });
    });
  };
  
  const deleteUser = (req, res) => {
    const { id } = req.body;
    console.log("a=>", id);
  
    // Query to get the user details before deletion
    const getUserQuery = `SELECT * FROM user WHERE id = ?`;
    
    con.query(getUserQuery, [id], (err, userResult) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching user details." });
      }
  
      if (userResult.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const userDetails = userResult[0]; // Assuming the first result is the user to delete
  
      // Now delete the user
      const deleteQuery = `DELETE FROM user WHERE id = ?`;
      
      con.query(deleteQuery, [id], (err, deleteResult) => {
        if (err) {
          return res.status(500).json({ message: "Something went wrong in user deletion." });
        }
  
        // Return the deleted user details in the response
        res.status(200).json({
          message: "User deleted successfully",
          success: "true",
          deletedUser: userDetails,
        });
      });
    });
  };
  
export {alluser, deleteUser}