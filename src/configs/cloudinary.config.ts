import { v2 as cloudinary } from "cloudinary";
import { IReqFile } from "../api/interfaces";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export default async (file: IReqFile) => {
    return await cloudinary.uploader.upload(file.path);
}