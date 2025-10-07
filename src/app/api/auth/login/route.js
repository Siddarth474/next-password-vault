import { NextResponse } from 'next/server';
import User from '@/models/user';
import { encryptSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'user not found', success: false }, { status: 404 }
            );
        }

        const validatePassword = await user.isPasswordCorrect(password);
        if(!validatePassword) {
            return NextResponse.json(
                { error: 'Wrong password', success: false }, { status: 400 }
            );
        }

        const session = await encryptSession({ userId: user._id.toString() });
        const cookieStore = await cookies();
        
        cookieStore.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return NextResponse.json(
            {message: "Login successfull", success: true }, 
            {status: 201}
        );
    } catch (error) {
        console.log('Something went wrong while login', error);
        return NextResponse.json(
            {error: error.message, success: false }, 
            { status: 500 }
        );
    }
}