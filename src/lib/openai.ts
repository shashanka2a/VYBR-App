// TODO: Re-enable OpenAI integration later
// import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface OnboardingMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

export interface UserPreferences {
  nationality?: string;
  age?: number;
  lifestyle?: string[];
  budgetMin?: number;
  budgetMax?: number;
  housingType?: string[];
  amenities?: string[];
  petFriendly?: boolean;
  smokingAllowed?: boolean;
  internationalFriendly?: boolean;
}

export class OnboardingAI {
  private static readonly SYSTEM_PROMPT = `You are VYBR's friendly AI assistant helping new students complete their housing preferences profile. 

Your goal is to collect the following information through a natural, conversational flow:
1. Nationality/Country of origin
2. Age (if comfortable sharing)
3. Lifestyle preferences (quiet/social/studious/party-friendly/etc)
4. Budget range for housing ($XXX - $XXX per month)
5. Housing type preferences (off-campus apartments, on-campus dorms)
6. Important amenities (gym, pool, parking, furnished, etc)
7. Special needs (pet-friendly, smoking allowed, international student support)

Guidelines:
- Be warm, friendly, and conversational
- Ask one question at a time to avoid overwhelming the user
- Acknowledge their responses before moving to the next question
- If they seem uncertain, provide examples or options
- Keep responses concise (1-2 sentences max)
- Use emojis occasionally to be friendly
- At the end, summarize their preferences and confirm

Start by introducing yourself and asking about their nationality/country of origin.`;

  static async generateResponse(
    messages: OnboardingMessage[],
    extractedPreferences?: Partial<UserPreferences>
  ): Promise<{ message: string; isComplete: boolean; preferences: Partial<UserPreferences> }> {
    // TODO: Re-enable OpenAI integration later
    /*
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role as 'assistant' | 'user',
        content: msg.content
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          ...conversationHistory
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        message: result.message || "I'm here to help! Let's start by learning about your background. What country are you from? 🌍",
        isComplete: result.isComplete || false,
        preferences: result.extractedPreferences || extractedPreferences || {}
      };

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
    */

    // Mock response for now
    const messageCount = messages.length;
    const lastMessage = messages[messages.length - 1];
    
    // Simple mock conversation flow
    if (messageCount <= 2) {
      return {
        message: "Thanks for sharing! What&apos;s your age and what year are you in school? 📚",
        isComplete: false,
        preferences: { nationality: "International" }
      };
    } else if (messageCount <= 4) {
      return {
        message: "Great! What&apos;s your budget range for housing per month? 💰",
        isComplete: false,
        preferences: { ...extractedPreferences, age: 20 }
      };
    } else if (messageCount <= 6) {
      return {
        message: "Perfect! Are you looking for on-campus or off-campus housing? 🏠",
        isComplete: false,
        preferences: { ...extractedPreferences, budgetMin: 800, budgetMax: 1200 }
      };
    } else {
      return {
        message: "Thanks for sharing your preferences! Your profile is now complete. Let&apos;s get you matched with perfect housing! 🎉",
        isComplete: true,
        preferences: { 
          ...extractedPreferences, 
          housingType: ["off_campus"], 
          internationalFriendly: true 
        }
      };
    }
  }

  static async extractPreferences(conversationHistory: OnboardingMessage[]): Promise<UserPreferences> {
    // TODO: Re-enable OpenAI integration later
    /*
    try {
      const conversation = conversationHistory
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n');

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: [
          {
            role: "system",
            content: `Analyze the conversation and extract user preferences. Return ONLY a JSON object with these fields:
            {
              "nationality": "string or null",
              "age": "number or null", 
              "lifestyle": "array of strings or null",
              "budgetMin": "number or null",
              "budgetMax": "number or null", 
              "housingType": "array of strings (off_campus/on_campus) or null",
              "amenities": "array of strings or null",
              "petFriendly": "boolean or null",
              "smokingAllowed": "boolean or null",
              "internationalFriendly": "boolean or null"
            }`
          },
          {
            role: "user",
            content: conversation
          }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Failed to extract preferences:', error);
      return {};
    }
    */

    // Mock preferences extraction for now
    return {
      nationality: "International",
      age: 20,
      lifestyle: ["studious", "social"],
      budgetMin: 800,
      budgetMax: 1200,
      housingType: ["off_campus"],
      amenities: ["gym", "pool", "parking"],
      petFriendly: false,
      smokingAllowed: false,
      internationalFriendly: true
    };
  }
}