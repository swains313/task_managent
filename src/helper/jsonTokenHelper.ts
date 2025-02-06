import jwt from 'jsonwebtoken'

export const generateToken =  async (payload:any) => {
    try {
        const secret = process.env.JWT_SECRET
        if(!secret){
            throw new Error("Secret key is missing")
        }
        return await
        jwt.sign(
           payload.toObject(),
            secret,
            { expiresIn: '1h' }
        );
    } catch (error) {
        console.log(error);
        
    }

}