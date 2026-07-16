import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import {
    useLoginMutation,
    useLogoutMutation,
     
} from "@/hooks";
const useAuth = () => {
    const { getItem, setItem, removeItem } = useLocalStorage()
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation()
    const getToken = () => {
        return getItem(LOCAL_STORAGE_KEYS.token);
    };

    const setToken = (token) => {
        setItem(LOCAL_STORAGE_KEYS.token, token);
    }
    const setRole = (role) => {
        setItem(LOCAL_STORAGE_KEYS.adminRole, role);
    }
     
    const getRole = () => {
        return getItem(LOCAL_STORAGE_KEYS.adminRole);
    };
     
    const setSession = ({ token, role }) => {
        setToken(token);
        setRole(role);
    }
    const clearAuthToken = async () => {
        removeItem(LOCAL_STORAGE_KEYS.token);
        removeItem(LOCAL_STORAGE_KEYS.adminRole);
    }

    return { getToken, setToken, getRole, setRole, setSession, logout:logoutMutation, login: loginMutation, clearAuthToken};
}

export { useAuth }
