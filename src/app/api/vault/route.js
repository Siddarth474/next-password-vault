import { NextResponse } from 'next/server';
import { decryptSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/user';

export async function GET() {
    try {
        await connectDB();
        const session = await decryptSession();
    
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized', success: false }, 
                { status: 401 }
            );
        }
    
        const user = await User.findById(session.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { vault: user.vault || [], success: true }
        );
    } catch (error) {
        console.error('GET /api/vault error:', error.message);
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const session = await decryptSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const { vault } = await req.json();

        if (!Array.isArray(vault)) {
            return NextResponse.json(
                { error: 'Invalid vault format', success: false },
                { status: 400 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.userId,
            { vault },
            { new: true, runValidators: false } 
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Saved', success: true },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('POST /api/vault error:', error.message);
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}