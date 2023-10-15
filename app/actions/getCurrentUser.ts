import { BACKEND_URL } from "@/lib/constant";
import axios from "axios";

export default async function getCurrentUser(token?: string){
    const response = await axios(`${BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });
    const user = response.data;

    return user;
}