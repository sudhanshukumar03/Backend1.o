import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) throw new Error("No file path provided");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        await fs.promises.unlink(localFilePath);
        //console.log("Cloudinary Response:", response);
        //return response;

        //fs.unlinkSync(localFilePath);

        //console.log("Cloudinary Upload Success:", response);

        return {
            url: response.secure_url,
            public_id: response.public_id
        };

    } catch (error) {
        console.error("Cloudinary Error:", error.message);

        if (localFilePath && fs.existsSync(localFilePath)) {
            await fs.promises.unlink(localFilePath);
        }

        return null;
    }
};