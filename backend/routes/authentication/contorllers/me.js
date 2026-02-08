import User from "../../../models/user.model.js"


export const getMe = async (req,res)=>{
    try {
         
        const user = await User.findById(req.user?.id).select("-password")
        if(!user) {
            return res.status(401).json({message:"user not exist"})
        }
        
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        console.log("error in get me controller")
    }
}