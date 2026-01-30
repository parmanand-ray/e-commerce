import { response, catchError, isAuthenticated } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import { makeSlug } from "@/lib/utils";
import { connectDB } from "@/lib/dbconn";
import { zSchema } from "@/lib/zodSchema";
export async function POST(request) {
  try {

    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    await connectDB();
    const payload = await request.json();
const schema = zSchema.pick({ name: true, slug: true });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const { name, slug } = validate.data;       
   
    const existingCategory = await CategoryModel.findOne({ $or: [ { name }, { slug } ], deletedAt: null }); 
    if (existingCategory) {
        return response(false, 409, "Category with the same name or slug already exists."); 
    }

    const newCategory = new CategoryModel({ name, slug });
    await newCategory.save();
    return response(true, 201, "Category created successfully", newCategory);
    } catch (error) {
    return catchError(error, "Failed to create category");
    }
}

