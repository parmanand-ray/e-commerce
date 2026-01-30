import { connectDB } from "@/lib/dbconn";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized User");
    }

    await connectDB();
    const getParams = await params;
    const id = getParams.id;
    const filter = {
      deletedAt: null,
    };

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Object ID");
    }
    filter._id = id;
    const getMedia = await MediaModel.findOne(filter).lean();
    if(!getMedia){
        return response(false,404,'Data Not Exits.');
    }
    return response(true,200,'Media Exits.',getMedia);
  } catch (error) {
    return catchError(error);
  }
}
