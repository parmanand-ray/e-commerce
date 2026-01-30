import { connectDB } from "@/lib/dbconn";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized User");
    }

    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({ _id: true, alt: true, title: true });
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(
        false,
        400,
        "invalid request data",
        validate.error.errors,
      );
    }
    const { _id, alt, title } = validate.data;

    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid Object ID");
    }

    const getMedia = await MediaModel.findOne({ _id, deletedAt: null });
    if (!getMedia) {
      return response(false, 404, "Media Not Found");
    }
    getMedia.alt = alt;
    getMedia.title = title;
    await getMedia.save();

    return response(true, 200, "Media Updated Successfully");
  } catch (error) {
    return catchError(error);
  }
}
