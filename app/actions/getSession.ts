import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";

export default async function getSession() { // getsession ở Server
    return await getServerSession(authOptions);
}