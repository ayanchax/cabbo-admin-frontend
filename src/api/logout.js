import { queryClient } from "@/api/queryClient";

const logout = () => {
    queryClient.clear();
    queryClient.setQueryData(["isLoggedIn"], false);
}

export {logout}
