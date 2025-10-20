import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, id } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    console.log('Saving content:', {
      id: id || 'default',
      content,
      timestamp: new Date().toISOString(),
    });


    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      id: id || 'default',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || 'default';

    console.log('Fetching content for id:', id);


    return NextResponse.json({
      success: true,
      content: null, 
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
