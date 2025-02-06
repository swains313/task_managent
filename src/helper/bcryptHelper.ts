import bcryptjs from 'bcryptjs';

export const comparePassword = async (password: string, hashPassword: string) => {
    try {
        if (!password || !hashPassword) {
            throw new Error("Both password and hashPassword must be provided.");
        }

        return await bcryptjs.compare(password, hashPassword);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw error; 
    }
};
