import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { topic, grade, type, customKey } = await req.json();

    if (!topic || !type) {
      return NextResponse.json({ error: "Missing topic or type" }, { status: 400 });
    }

    const apiKeyToUse = customKey || process.env.GROQ_API_KEY;
    if (!apiKeyToUse) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 401 });
    }

    const groq = new Groq({ apiKey: apiKeyToUse });

    let prompt = `Bạn là một chuyên gia thiết kế bài tập tiếng Anh theo chuẩn Global Success.
Chủ đề: ${topic}
Lớp: ${grade}
`;

    if (type === "quiz") {
      prompt += `Yêu cầu tạo 5 câu hỏi trắc nghiệm (Tập trung vào từ vựng hoặc ngữ pháp).
Trả về JSON có cấu trúc sau:
{
  "quizQuestions": [
    {
      "question": "Câu hỏi bằng tiếng Anh?",
      "options": ["A. Lựa chọn 1", "B. Lựa chọn 2", "C. Lựa chọn 3", "D. Lựa chọn 4"],
      "correctAnswer": "A" // Chỉ lấy chữ cái A, B, C hoặc D
    }
  ]
}`;
    } else if (type === "dictation") {
      prompt += `Yêu cầu tạo 1 bài nghe/điền từ (Dictation). Viết 1 đoạn văn hoặc 1 đoạn hội thoại ngắn tiếng Anh gọn gàng (khoảng 50-80 từ).
Bạn phải BỌC NGOẶC VUÔNG [ ] cho những từ vựng quan trọng (cần học sinh nghe và điền vào chỗ trống). Ví dụ: Hello [world], this is a [test].
Trả về JSON có cấu trúc sau:
{
  "expectedText": "Nội dung đoạn văn có chứa ngoặc vuông cho từ cần điền"
}`;
    } else if (type === "speaking") {
      prompt += `Yêu cầu tạo 1 câu hoặc 1 đoạn hội thoại rất ngắn bằng tiếng Anh để học sinh luyện nói.
Trả về JSON có cấu trúc sau:
{
  "expectedText": "Nội dung tiếng Anh học sinh cần nói"
}`;
    }

    prompt += `\nCHỈ TRẢ VỀ JSON HỢP LỆ, KHÔNG CÓ MARKDOWN HAY VĂN BẢN NÀO KHÁC.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseContent);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate activity error:", error);
    return NextResponse.json({ error: "Failed to generate activity" }, { status: 500 });
  }
}
