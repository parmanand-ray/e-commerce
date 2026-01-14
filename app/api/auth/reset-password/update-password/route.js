import { connectDB } from "@/lib/dbconn";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(request) {
    try {
        await connectDB();
        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email:true, password:true
        });

        const validatedData = validationSchema.safeParse(payload);
        if(!validatedData.success){
            return response(false,401,'Invalid data or Missing Input Feilds',validatedData.error);

        }

        const {email, password} = validatedData.data;

        const getUser = await UserModel.findOne({deleteAt:null, email}).select('+password');
        if(!getUser){
            return response(false,400,'User Not Found !');
        }

       getUser.password = password;
       await getUser.save();
       return response(true,200,'Password Reset Successfully.');
    } catch (error) {
        catchError(error);
    }
}