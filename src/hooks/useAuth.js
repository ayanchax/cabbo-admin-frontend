import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import {
    useLoginMutation,
     
} from "./mutation";
const useAuth = () => {
    const { getItem, setItem, removeItem } = useLocalStorage()
    const loginMutation = useLoginMutation();
    const getToken = () => {
        return getItem(LOCAL_STORAGE_KEYS.token);
    };

    const setToken = (token) => {
        setItem(LOCAL_STORAGE_KEYS.token, token);
    }
    const setRole = (role) => {
        setItem(LOCAL_STORAGE_KEYS.adminRole, role);
    }
    const setUserId = (userId) => {
        setItem(LOCAL_STORAGE_KEYS.adminUserId, userId);
    }
    const getUserId = () => {
        return getItem(LOCAL_STORAGE_KEYS.adminUserId);
    };
    const getRole = () => {
        return getItem(LOCAL_STORAGE_KEYS.adminRole);
    };
    const setTokenExpiresAt = (expiresInSeconds) => {
        if (!expiresInSeconds) return;
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
        setItem(LOCAL_STORAGE_KEYS.adminTokenExpiresAt, expiresAt);
    }
    const setSession = ({ token, role, expiresIn, userId }) => {
        setToken(token);
        setUserId(userId);
        setRole(role);
        setTokenExpiresAt(expiresIn);
    }
    const logout = () => {
        removeItem(LOCAL_STORAGE_KEYS.token);
        removeItem(LOCAL_STORAGE_KEYS.adminUserId);
        removeItem(LOCAL_STORAGE_KEYS.adminRole);
        removeItem(LOCAL_STORAGE_KEYS.adminTokenExpiresAt);
    }

    return { getToken, setToken, getUserId, setUserId, getRole, setRole, setSession, logout, login: loginMutation,};
}

export { useAuth }
