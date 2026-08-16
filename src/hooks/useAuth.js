import { LOCAL_STORAGE_KEYS } from "@/utils";
import {
    useLoginMutation,
    useLogoutMutation,
} from "@/hooks";



const useAuth = () => {
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation()

    return {
        logout: logoutMutation,
        login: loginMutation,
    };
}

export { useAuth }
