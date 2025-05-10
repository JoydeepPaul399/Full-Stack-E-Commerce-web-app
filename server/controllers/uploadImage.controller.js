import uploadImageClodinary from "../utils/uploadImageClodinary.js"

const uploadImageController= async (req, res)=>{
    try{
        const file= req.file
        // console.log(file)

        const uploadImage= await uploadImageClodinary(file)

        return res.json({
            message: "Image uploaded successfully",
            error: false,
            success: true,
            data: uploadImage

        })
    }

    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default uploadImageController