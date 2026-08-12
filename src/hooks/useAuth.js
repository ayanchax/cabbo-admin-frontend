import { LOCAL_STORAGE_KEYS } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
    useLoginMutation,
    useLogoutMutation,
} from "@/hooks";

const useAuth = () => {
    const queryClient = useQueryClient();
    const loginMutation = useLoginMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isLoggedIn"] });
            queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
        },
    });

    const logoutMutation = useLogoutMutation({
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["isLoggedIn"] });
            queryClient.removeQueries({ queryKey: ["adminProfile"] });
        },
    })

    return {
        logout: logoutMutation,
        login: loginMutation,
    };
}

export { useAuth }
