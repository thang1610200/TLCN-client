import { Separator } from "@/components/ui/separator"
import ProfileForm from "../components/profile-form"
import getSession from "../../actions/getSession";
import getCurrentUser from "../../actions/getCurrentUser";

export default async function SettingsProfilePage() {
    const session = await getSession();
    const user = await getCurrentUser(session?.backendTokens.accessToken)
    return (
        <div className="space-y-6">
            <Separator />
            <ProfileForm user={user} token={session?.backendTokens.accessToken} />
        </div>
    )
}