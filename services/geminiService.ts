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

  // Use gemini-2.0-flash-exp for reliable multimodal support (images, pdfs)
  const modelName = 'gemini-2.0-flash-exp'; 

  // Initialize parts with source text
  let sourceContentText = params.sourceText;
  
  // Append text from source files (DOCX/HTML)
  params.sourceFiles.forEach(file => {
    if (file.text) {
      sourceContentText += `\n\n[EK KAYNAK DOSYA: ${file.name}]:\n${file.text}`;
    }
  });

  // Construct instruction for style files
  let styleInstruction = '';
  let styleContentText = '';
  
  params.styleFiles.forEach(file => {
    if (file.text) {
      styleContentText += `\n\n[ÖRNEK SINAV METNİ: ${file.name}]:\n${file.text}`;
    }
  });

  if (params.styleFiles.length > 0) {
    styleInstruction = 'ÖNEMLİ: Ekteki örnek sınav/stil dosyalarını (PDF, görsel veya metin) analiz et. Oluşturacağın yeni soruların tonunu, soru tipini, zorluk seviyesini ve yapısını bu örneklerdeki sorulara benzet.';
    if (styleContentText) {
      styleInstruction += `\n\nAşağıdaki örnek metinleri de dikkate al:\n${styleContentText}\n-----------------------------------\n`;
    }
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
    (Eğer dosya eklenmişse onların içeriğini, görsellerini ve/veya aşağıdaki metni kullan)
    "${sourceContentText}"
  `;

  const parts: any[] = [{ text: promptText }];

  // Add Source Files (Images/PDFs)
  params.sourceFiles.forEach(file => {
    if (file.data && file.mimeType) {
      parts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType
        }
      });
    }
  });

  // Add Style Files (Images/PDFs)
  params.styleFiles.forEach(file => {
    if (file.data && file.mimeType) {
      parts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType
        }
      });
    }
  });

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

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = "Soru oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.";
    
    // Check for specific error codes
    if (error.message && error.message.includes("404")) {
      errorMessage = "Hata: Seçilen yapay zeka modeli bulunamadı veya şu anda kullanılamıyor (404).";
    } else if (error.status === 404) {
       errorMessage = "Hata: Seçilen yapay zeka modeli bulunamadı (404).";
    } else if (error.message) {
      errorMessage = `Hata: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};