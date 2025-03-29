import { NextResponse } from "next/server";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const runtime = "edge";

export async function POST(request: Request) {
    try {
        const prompt = `
            Create a list of three open-ended and engaging questions formatted as a single string. 
            Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, 
            and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes 
            that encourage friendly interaction. For example, your output should be structured like this: 
            "What's a hobby you have learned recently? || If you could travel anywhere in the world, where would you go and why? || 
            What's a book or movie that has had a significant impact on your life?". 
            Ensure that the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
        `;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${response.statusText}, ${errorText}`);
        }

        const data = await response.json();
        // console.log("Gemini API Response:", data);

        const generatedResponse = data.candidates?.[0]?.content?.parts
            ?.map((part: any) => part.text.trim())
            .join(" ") || "No response received.";

        // console.log("Generated Response:", generatedResponse);

        const stream = new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(generatedResponse));
                controller.close();
            },
        });
        return NextResponse.json({ questions: generatedResponse });

    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
