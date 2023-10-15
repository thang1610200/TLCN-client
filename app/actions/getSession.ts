import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function getSession() { // getsession ở Server
    return await getServerSession(authOptions);
}