import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (
                /* pathname, clientPayload */
            ) => {
                // Here you can check if the user is authorized to upload
                // e.g. using next-auth
                return {
                    allowedContentTypes: [
                        'image/jpeg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                        'image/avif',
                        'video/mp4',
                        'video/webm',
                        'video/quicktime',
                        'video/x-m4v',
                        'video/mpeg',
                    ],
                    tokenPayload: JSON.stringify({
                        // optional, sent to your server on upload completion
                        // userId: session.user.id,
                    }),
                };
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
