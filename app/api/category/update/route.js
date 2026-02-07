import { response, catchError } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import { connectDB } from "@/lib/dbconn";
import { zSchema } from "@/lib/zodSchema";
import { isAuthenticated } from "@/lib/authentication";
export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();
    const schema = zSchema.pick({ _id: true, name: true, slug: true });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const { _id, name, slug } = validate.data;

    const getCategory = await CategoryModel.findOne({ deletedAt: null, _id });
    if (!getCategory) {
      return response(false, 404, "Category Not Found");
    }

    getCategory.name = name;
    getCategory.slug = slug;

    await getCategory.save();
    return response(true, 201, "Category Updated successfully", getCategory);
  } catch (error) {
    return catchError(error, "Failed to update category");
  }
}
