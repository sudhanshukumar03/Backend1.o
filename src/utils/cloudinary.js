

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadToCloudinary = async (localFilePath) => {
    console.log("📂 File path received:", localFilePath);

    try {
        if (!localFilePath) {
            console.log("❌ No file path");
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("✅ Uploaded to Cloudinary");

        return response;

    } catch (error) {
        console.error("❌ Upload error:", error);
        return null;

    } finally {
        console.log("🧹 Trying to delete file...");

        try {
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log("✅ File deleted successfully");
            } else {
                console.log("⚠️ File NOT found");
            }
        } catch (err) {
            console.error("❌ Delete error:", err);
        }
    }
};

export { uploadToCloudinary };