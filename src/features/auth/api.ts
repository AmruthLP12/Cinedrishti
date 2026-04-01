import { ID } from "appwrite";
import { account } from "@/lib/appwrite";

const register = async (name: string, email: string, password: string) => {
    try {
        const user = await account.create(
            ID.unique(),
            email,
            password,
            name,
        );
        return user;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

const login = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

const logout = async () => {
    try {
        await account.deleteSession("current");
    }catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

const getUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
};

const getSession = async () => {
    try {
        const session = await account.getSession("current");
        return session;
    } catch (error) {
        console.error("Error getting session:", error);
        throw error;
    }
};

export { register, login, logout, getUser, getSession };