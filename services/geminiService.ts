import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerateQuizParams, QuizQuestion } from "../types";

const processEnvApiKey = process.env.API_KEY;

if (!processEnvApiKey) {
  console.error("API_KEY is not set in environment variables.");
}

// Define the schema for the output
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      question: { type: Type.STRING },
      options: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
      explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
    },
    required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
  }
};

export const generateQuizQuestions = async (params: GenerateQuizParams): Promise<QuizQuestion[]> => {
  if (!processEnvApiKey) {
    throw new Error("API Key eksik. Lütfen yapılandırmayı kontrol edin.");
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

  const modelName = 'gemini-2.5-flash-latest'; 

  // Construct instruction for style file/text
  let styleInstruction = '';
  if (params.styleFileBase64) {
    styleInstruction = 'ÖNEMLİ: Ekteki stil/örnek sınav dosyasını analiz et. Oluşturacağın yeni soruların tonunu, soru tipini ve yapısını bu örnek dosyadaki sorulara benzet.';
  } else if (params.styleFileText) {
    styleInstruction = `ÖNEMLİ: Aşağıdaki "ÖRNEK SINAV METNİ"ni analiz et. Oluşturacağın yeni soruların tonunu, soru tipini ve yapısını buna benzet.\n\nÖRNEK SINAV METNİ:\n${params.styleFileText}\n-----------------------------------\n`;
  }

  const promptText = `
    Sen uzman bir eğitimci ve sınav hazırlayıcısısın.
    
    GÖREV:
    Aşağıdaki KAYNAK İÇERİK'ten ${params.questionCount} adet çoktan seçmeli soru oluştur.
    Zorluk seviyesi: ${params.difficulty}.
    Dil: Türkçe.
    
    KURALLAR:
    1. Her soru için 4 seçenek (A, B, C, D) olmalıdır.
    2. Cevaplar kesin ve net olmalıdır.
    3. JSON formatında çıktı ver.
    
    ${styleInstruction}
    
    KAYNAK İÇERİK:
    (Eğer bir dosya eklenmişse onun içeriğini, ve/veya aşağıdaki metni kullan)
    "${params.sourceText}"
  `;

  const parts: any[] = [{ text: promptText }];

  // Add Source File PDF if exists
  if (params.sourceFileBase64 && params.sourceFileMimeType) {
     parts.push({
      inlineData: {
        data: params.sourceFileBase64,
        mimeType: params.sourceFileMimeType
      }
    });
  }

  // Add Style File PDF if exists
  if (params.styleFileBase64 && params.styleFileMimeType) {
    parts.push({
      inlineData: {
        data: params.styleFileBase64,
        mimeType: params.styleFileMimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7, // Creative enough for good questions, stable enough for format
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("API'den boş yanıt döndü.");
    }

    const quizData = JSON.parse(text) as QuizQuestion[];
    return quizData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Soru oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};