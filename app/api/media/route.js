import { connectDB } from "@/lib/dbconn";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin');
        if(!auth.isAuth){
            return response(false,403,"Unauthorized User");
        }

        await connectDB();
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page'),10) || 0;
        const limit = parseInt(searchParams.get('limit'),10) || 10;
        const deleteType = searchParams.get('deleteType');

        //SD => soft delete, RSD => Restore Soft Delete, PD => Permanat Delete

        let filter = {};
        if(deleteType === 'SD'){
            filter = {deletedAt:null};
        } else if(deleteType === 'RSD' ){
            filter = {deletedAt: {$ne : null}}
        }
    } catch (error) {
        return catchError(error);
    }
}