import { NextResponse } from 'next/server';
import User from '@/models/user';
import { connectDB } from '@/lib/db';

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();
    
        if (!email || !password || password.length < 8) {
            return NextResponse.json(
                { error: 'Invalid input', success: false }, 
                { status: 400 }
            );
        }
    
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json(
                {error: 'User exists', success: false }, 
                { status: 409 }
            );
        }
    
        await User.create({ email, password });

        return NextResponse.json(
            {message: "Signup successfull", success: true }, 
            {status: 201}
        );

    } catch (error) {
        console.log('Something went wrong while signup', error);
        return NextResponse.json(
            {error: error.message, success: false }, 
            { status: 500 }
        );
    }
}