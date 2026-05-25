import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { topic, grade, duration, activities, customKey } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const apiKeyToUse = customKey || process.env.GROQ_API_KEY;
    if (!apiKeyToUse) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 401 });
    }

    const groq = new Groq({ apiKey: apiKeyToUse });

    const prompt = `Bạn là một chuyên gia giáo dục thiết kế bài giảng tiếng Anh theo chuẩn sách giáo khoa Global Success của Bộ GD&ĐT Việt Nam.
Hãy thiết kế một bài giảng tóm tắt với các thông tin sau:
- Lớp: ${grade}
- Chủ đề bài học: ${topic}
- Thời lượng: ${duration} phút
- Các hoạt động muốn tập trung: ${activities.join(", ")}

Yêu cầu định dạng JSON phản hồi chính xác (không có markdown \`\`\`json):
{
  "objective": "Mục tiêu bài học (1-2 câu ngắn gọn, ngôn ngữ năng động)",
  "vocab": ["Từ 1", "Từ 2", "Từ 3", "Từ 4", "Từ 5"],
  "warmup": "Gợi ý hoạt động khởi động 5-10 phút",
  "practice": "Gợi ý hoạt động thực hành chính",
  "game": "Gợi ý một trò chơi minigame gắn với bài học để củng cố kiến thức"
}

Hãy đảm bảo phản hồi CHỈ là một JSON object hợp lệ, không có văn bản nào khác.`;

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
    console.error("Generate lesson error:", error);
    return NextResponse.json({ error: "Failed to generate lesson plan" }, { status: 500 });
  }
}
