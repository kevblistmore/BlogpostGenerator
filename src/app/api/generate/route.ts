// app/api/generate/route.ts
import { OpenAI } from 'openai';
import { z } from 'zod';

// Validate the incoming topic using Zod
const schema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters').max(100, 'Topic is too long'),
});

export async function POST(req: Request) {
  // Create an instance of OpenAI using your API key
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { topic } = await req.json();
    const validation = schema.safeParse({ topic });
    
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Invalid topic (3-100 characters required)',
      }), { status: 400 });
    }

    // Build the prompt for the AI
    const prompt = `Create a comprehensive blog post about "${topic}" with:
    - Engaging introduction
    - 3 main sections with subheadings
    - Practical examples
    - Clear conclusion
    Format using markdown without frontmatter.`;
    
    // Call the OpenAI API using the chat completion endpoint
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional blog writer" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    return new Response(JSON.stringify({
      content: completion.choices[0].message.content,
    }), { status: 200 });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate content',
    }), { status: 500 });
  }
}
