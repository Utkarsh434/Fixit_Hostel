// app/api/tickets/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    // --- MODIFICATION: Get new fields from the body ---
    const { title, description, hostel, roomNumber } = body;

    if (!title || !description || !hostel || !roomNumber) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    let aiCategory: any = 'OTHER';
    let aiPriority: any = 'P3_NORMAL';

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        Analyze the following hostel maintenance request and classify it into one of the given categories and priority levels.
        Description: "${description}"
        Available Categories: ELECTRICAL, PLUMBING, CARPENTRY, INTERNET, OTHER
        Available Priorities: P1_CRITICAL, P2_HIGH, P3_NORMAL, P4_LOW
        Rules:
        - P1_CRITICAL: Major issues like power outage, no water, major leaks, safety hazards.
        - P2_HIGH: Affects multiple people, e.g., Wi-Fi down, broken door lock.
        - P3_NORMAL: Standard individual requests, e.g., broken chair, flickering light.
        - P4_LOW: Minor cosmetic issues.
        Respond ONLY with a valid JSON object in the format: {"category": "CATEGORY_NAME", "priority": "PRIORITY_LEVEL"}
      `;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      
      const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiResponse = JSON.parse(cleanedJsonString);

      if (aiResponse.category && aiResponse.priority) {
        aiCategory = aiResponse.category;
        aiPriority = aiResponse.priority;
      }

    } catch (aiError) {
      console.error("--- Gemini AI Error ---:", aiError);
    }

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        hostel, // Save hostel
        roomNumber, // Save room number
        studentId: session.user.id,
        category: aiCategory,
        priority: aiPriority,
      },
    });

    return NextResponse.json(newTicket);

  } catch (error) {
    console.error("--- General Server Error ---:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
