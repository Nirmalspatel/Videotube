import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});


const uploadToCloudinary = async (localfilePath)=>{
    try {
        if(!localfilePath)return null;
            const response = await cloudinary.uploader.upload(localfilePath, {
                resource_type: "auto",
            });
            //file has been uploaded to cloudinary, now we can remove it from local uploads folder
        console.log("Cloudinary URL:", response.url);

            return response;
            
        } catch (error) {
        fs.unlinkSync(localfilePath);
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
}

export { uploadToCloudinary };