import getCurrentUser from "@/app/actions/getCurrentUser";
import getSession from "@/app/actions/getSession";
import SetPasswordForm from "../components/set-password";
import UpdatePasswordForm from "../components/update-password";

const ChangePassword = async () => {
    const session = await getSession();
    const user = await getCurrentUser(session?.backendTokens.accessToken)
    return (
        <div className="p-10 border-2 rounded-lg">
            {
                !user?.password 
                ? (
                    <SetPasswordForm/>
                ): (
                    <UpdatePasswordForm />
                )
            }
        </div>
    );
}

export default ChangePassword;