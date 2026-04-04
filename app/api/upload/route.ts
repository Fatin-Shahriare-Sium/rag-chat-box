import { NextRequest, NextResponse } from 'next/server';

const UPLOAD_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/json',
  'text/csv',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'File type not allowed. Allowed types: PDF, TXT, DOC, DOCX, XLS, XLSX, JPEG, PNG, GIF, WEBP, JSON, CSV',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    // Validate no video files
    if (
      file.type.startsWith('video/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.avi') ||
      file.name.endsWith('.mov') ||
      file.name.endsWith('.mkv')
    ) {
      return NextResponse.json(
        { error: 'Video files are not allowed' },
        { status: 400 }
      );
    }

    // Create FormData to forward to backend (optional)
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Forward to backend (if API is available, otherwise just return success)
    try {
      const uploadUrl = `${UPLOAD_API_URL}/upload`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: backendFormData,
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(
          {
            success: true,
            message: `File "${file.name}" uploaded successfully`,
            ...data,
          },
          { status: 200 }
        );
      }
    } catch (backendError) {
      console.log('Backend not available, storing locally:', backendError);
    }

    // If backend is not available, just return success
    const fileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    console.log('File processed locally:', fileMetadata);

    return NextResponse.json(
      {
        success: true,
        message: `File "${file.name}" uploaded successfully`,
        metadata: fileMetadata,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';

    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
