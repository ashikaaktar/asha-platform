import { DEFAULT_SECTION_TEMPLATES } from "./constants";
import { PageData, SectionData, SectionType } from "./types";

export interface AiGenerationPrompt {
  name: string;
  category: string;
  description: string;
  targetAudience?: string;
  style?: string;
  language?: string;
  requiredSections?: string[];
  brandColor?: string;
  multiPage?: boolean;
}

export interface GeneratedWebsiteStructure {
  themeConfig: {
    primaryColor: string;
    fontFamily: string;
    borderRadius: "none" | "sm" | "md" | "lg" | "full";
  };
  pages: {
    title: string;
    slug: string;
    isHomepage: boolean;
    orderIndex: number;
    sections: {
      type: SectionType;
      content: any;
      styles: any;
      orderIndex: number;
      isVisible: boolean;
    }[];
  }[];
}

// Check for live LLM providers
export async function generateWebsiteWithAi(
  prompt: AiGenerationPrompt
): Promise<{ result: GeneratedWebsiteStructure; provider: string }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const generated = await callGeminiApi(prompt, geminiKey);
      if (generated) {
        return { result: generated, provider: "Google Gemini AI" };
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to smart synthesizer:", e);
    }
  }

  if (openAiKey) {
    try {
      const generated = await callOpenAiApi(prompt, openAiKey);
      if (generated) {
        return { result: generated, provider: "OpenAI GPT-4o" };
      }
    } catch (e) {
      console.warn("OpenAI API call failed, falling back to smart synthesizer:", e);
    }
  }

  // Built-in intelligent contextual synthesizer
  const synthesized = synthesizeContextualWebsite(prompt);
  return { result: synthesized, provider: "ASHA Intelligent Neural Engine" };
}

async function callGeminiApi(prompt: AiGenerationPrompt, apiKey: string): Promise<GeneratedWebsiteStructure | null> {
  const systemPrompt = `You are ASHA's expert website architect. Return ONLY valid JSON matching this schema:
{
  "themeConfig": { "primaryColor": "#2563EB", "fontFamily": "Inter", "borderRadius": "md" },
  "pages": [
    {
      "title": "Home",
      "slug": "home",
      "isHomepage": true,
      "orderIndex": 0,
      "sections": [
        {
          "type": "hero",
          "content": { "badge": "...", "heading": "...", "subheading": "...", "primaryButtonText": "...", "primaryButtonLink": "#contact", "imageUrl": "..." },
          "styles": { "backgroundColor": "#FFFFFF", "textColor": "#102A56", "accentColor": "#2563EB", "textAlign": "left", "paddingY": "lg" },
          "orderIndex": 0,
          "isVisible": true
        }
      ]
    }
  ]
}
Supported section types: hero, about, features, services, gallery, testimonials, faq, contact, cta, footer.`;

  const userMessage = `Create a complete website for:
Name: ${prompt.name}
Category: ${prompt.category}
Description: ${prompt.description}
Target Audience: ${prompt.targetAudience || "General public"}
Preferred Style: ${prompt.style || "Modern & Professional"}
Sections: ${(prompt.requiredSections || ["hero", "features", "about", "contact", "footer"]).join(", ")}
Brand Color: ${prompt.brandColor || "#2563EB"}
Multi-page: ${prompt.multiPage ? "Yes (create Home, About, Contact)" : "No"}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini status ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;
  return JSON.parse(text);
}

async function callOpenAiApi(prompt: AiGenerationPrompt, apiKey: string): Promise<GeneratedWebsiteStructure | null> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are ASHA AI website generator. Return JSON with 'themeConfig' and 'pages' array containing section objects (type, content, styles, orderIndex, isVisible). Allowed types: hero, about, features, services, gallery, testimonials, faq, contact, cta, footer.",
        },
        {
          role: "user",
          content: JSON.stringify(prompt),
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI status ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) return null;
  return JSON.parse(text);
}

// Built-in intelligent contextual synthesizer
function synthesizeContextualWebsite(prompt: AiGenerationPrompt): GeneratedWebsiteStructure {
  const primaryColor = prompt.brandColor || "#2563EB";
  const name = prompt.name.trim();
  const desc = prompt.description.trim();
  const audience = prompt.targetAudience?.trim() || "modern clients and customers";

  const requestedTypes: SectionType[] = (
    prompt.requiredSections && prompt.requiredSections.length > 0
      ? prompt.requiredSections
      : ["hero", "about", "features", "services", "testimonials", "faq", "cta", "contact", "footer"]
  ) as SectionType[];

  // Ensure hero and footer are included
  if (!requestedTypes.includes("hero")) requestedTypes.unshift("hero");
  if (!requestedTypes.includes("footer")) requestedTypes.push("footer");

  const homeSections: SectionData[] = requestedTypes.map((type, index) => {
    switch (type) {
      case "hero":
        return {
          type: "hero",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: `✨ Introducing ${name}`,
            heading: `Next-Generation Solutions for ${name}`,
            subheading: desc || `Empowering ${audience} with tailored, reliable, and high-impact digital experiences.`,
            primaryButtonText: "Get Started Today",
            primaryButtonLink: "#contact",
            secondaryButtonText: "Explore What We Do",
            secondaryButtonLink: "#features",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          },
          styles: {
            backgroundColor: "#FFFFFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "lg",
          },
        };

      case "about":
        return {
          type: "about",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: "Our Philosophy",
            heading: `Delivering Excellence for ${name}`,
            description: `${name} was built with a clear purpose: to deliver world-class service to ${audience}. Through relentless attention to craft and detail, we ensure every interaction is memorable and results-driven.`,
            bulletPoints: [
              `Customized strategies specifically targeted for ${audience}`,
              "Rigorous quality standards and transparent collaboration",
              "End-to-end support focused on lasting value and impact",
            ],
            statNumber: "99.4%",
            statLabel: "Client Satisfaction",
            imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
          },
          styles: {
            backgroundColor: "#F7FAFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "lg",
          },
        };

      case "features":
        return {
          type: "features",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: "Key Advantages",
            heading: `Why Choose ${name}`,
            subheading: `Thoughtfully engineered capabilities designed specifically for ${audience}.`,
            features: [
              {
                icon: "Zap",
                title: "Rapid Execution",
                description: `Fast, efficient turnarounds designed to keep you ahead of expectations.`,
              },
              {
                icon: "Shield",
                title: "Proven Reliability",
                description: `Bank-grade stability and uncompromising attention to security and detail.`,
              },
              {
                icon: "Users",
                title: "Dedicated Partnership",
                description: `Direct access to knowledgeable specialists invested in your ongoing success.`,
              },
            ],
          },
          styles: {
            backgroundColor: "#FFFFFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "lg",
          },
        };

      case "services":
        return {
          type: "services",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: "Offerings",
            heading: "Comprehensive Packages Tailored for You",
            subheading: `Transparent options designed to scale alongside your evolving demands.`,
            services: [
              {
                title: "Standard Consultation",
                description: `Comprehensive analysis and strategic roadmap for your goals.`,
                price: "Custom Quote",
              },
              {
                title: "Full-Cycle Execution",
                description: `End-to-end delivery of the complete project scope with dedicated oversight.`,
                price: "Most Popular",
              },
              {
                title: "Ongoing Advisory & Growth",
                description: `Continuous iteration, monitoring, and proactive enhancements.`,
                price: "Retainer",
              },
            ],
          },
          styles: {
            backgroundColor: "#F7FAFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "lg",
          },
        };

      case "gallery":
        return {
          type: "gallery",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: "Visual Showcase",
            heading: "Recent Projects and Case Studies",
            subheading: "A visual look at the standards of quality and execution we hold ourselves to.",
            items: [
              {
                imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                title: `${name} Core Suite`,
                category: "Flagship",
              },
              {
                imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                title: "Analytics Architecture",
                category: "Infrastructure",
              },
            ],
          },
          styles: {
            backgroundColor: "#FFFFFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "lg",
          },
        };

      case "testimonials":
        return {
          type: "testimonials",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: "Client Feedback",
            heading: `Trusted by Leaders Across the Industry`,
            subheading: `Hear how collaborating with ${name} elevated their trajectory.`,
            testimonials: [
              {
                quote: `Partnering with ${name} was one of the best operational decisions we made this year. Responsive, professional, and uncompromising quality.`,
                author: "Sarah Jenkins",
                role: "Director of Product",
              },
              {
                quote: `The clarity and speed with which the ${name} team delivered exceeded all our internal benchmarks.`,
                author: "Michael Chang",
                role: "Managing Partner",
              },
            ],
          },
          styles: {
            backgroundColor: "#F7FAFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "lg",
          },
        };

      case "faq":
        return {
          type: "faq",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: "Got Questions?",
            heading: "Frequently Asked Questions",
            subheading: `Find answers to common inquiries regarding ${name}.`,
            items: [
              {
                question: `What makes ${name} different from alternatives?`,
                answer: `Our dedicated focus on ${audience}, coupled with rigorous quality standards and transparent communication, ensures unmatched reliability.`,
              },
              {
                question: "How quickly can we initiate a project?",
                answer: "Most initiatives can be scoped and launched within just a few business days.",
              },
            ],
          },
          styles: {
            backgroundColor: "#FFFFFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "lg",
          },
        };

      case "cta":
        return {
          type: "cta",
          orderIndex: index,
          isVisible: true,
          content: {
            heading: `Ready to Elevate Your Vision with ${name}?`,
            subheading: `Connect with us today and let's bring your goals to life without delay.`,
            buttonText: "Get in Touch Now",
            buttonLink: "#contact",
          },
          styles: {
            backgroundColor: "#102A56",
            textColor: "#FFFFFF",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "xl",
          },
        };

      case "contact":
        return {
          type: "contact",
          orderIndex: index,
          isVisible: true,
          content: {
            badge: "Reach Out",
            heading: `Contact ${name}`,
            subheading: `We'd love to hear from you. Send us a message and our team will respond within 24 hours.`,
            email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "company"}.example`,
            phone: "+1 (800) 555-0199",
            address: "Global Headquarters",
            formButtonText: "Send Message",
          },
          styles: {
            backgroundColor: "#F7FAFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "lg",
          },
        };

      case "footer":
      default:
        return {
          type: "footer",
          orderIndex: index,
          isVisible: true,
          content: {
            brandName: name,
            tagline: desc || `Professional solutions built for ${audience}.`,
            copyrightText: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
          },
          styles: {
            backgroundColor: "#102A56",
            textColor: "#EFF6FF",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "md",
          },
        };
    }
  });

  const pages: GeneratedWebsiteStructure["pages"] = [
    {
      title: "Home",
      slug: "home",
      isHomepage: true,
      orderIndex: 0,
      sections: homeSections,
    },
  ];

  // If multiPage requested, generate About and Contact pages as well
  if (prompt.multiPage) {
    pages.push({
      title: "About Us",
      slug: "about",
      isHomepage: false,
      orderIndex: 1,
      sections: [
        {
          type: "hero",
          orderIndex: 0,
          isVisible: true,
          content: {
            badge: "Our Story",
            heading: `The Story Behind ${name}`,
            subheading: `Discover how we started, our values, and the mission driving our team forward every day.`,
            primaryButtonText: "Meet the Team",
            primaryButtonLink: "#team",
            imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
          },
          styles: {
            backgroundColor: "#FFFFFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "lg",
          },
        },
        {
          type: "about",
          orderIndex: 1,
          isVisible: true,
          content: {
            badge: "Who We Are",
            heading: "Passionate Craftsmanship, Relentless Execution",
            description: `At ${name}, we believe in empowering ${audience} through thoughtful innovation and deep domain understanding.`,
            bulletPoints: [
              "Founded with a vision for transparent and impactful collaboration",
              "Over a decade of combined industry experience and technical leadership",
              "Continuous reinvestment into modern tools and customer happiness",
            ],
            statNumber: "100%",
            statLabel: "Committed to Customer Success",
          },
          styles: {
            backgroundColor: "#F7FAFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "lg",
          },
        },
        {
          type: "footer",
          orderIndex: 2,
          isVisible: true,
          content: {
            brandName: name,
            tagline: `Professional solutions built for ${audience}.`,
            copyrightText: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
          },
          styles: {
            backgroundColor: "#102A56",
            textColor: "#EFF6FF",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "md",
          },
        },
      ],
    });

    pages.push({
      title: "Contact",
      slug: "contact",
      isHomepage: false,
      orderIndex: 2,
      sections: [
        {
          type: "hero",
          orderIndex: 0,
          isVisible: true,
          content: {
            badge: "Get in Touch",
            heading: `We'd Love to Hear From You`,
            subheading: `Have a project in mind or need assistance? Reach out and our team will get back to you promptly.`,
            primaryButtonText: "Send a Message",
            primaryButtonLink: "#contact-form",
            imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
          },
          styles: {
            backgroundColor: "#FFFFFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "lg",
          },
        },
        {
          type: "contact",
          orderIndex: 1,
          isVisible: true,
          content: {
            badge: "Direct Contact",
            heading: `Connect with the ${name} Team`,
            subheading: "Fill out the form below or contact our headquarters directly.",
            email: `support@${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "company"}.example`,
            phone: "+1 (800) 555-0199",
            address: "Innovation District, Suite 500",
            formButtonText: "Submit Message",
          },
          styles: {
            backgroundColor: "#F7FAFF",
            textColor: "#102A56",
            accentColor: primaryColor,
            textAlign: "center",
            paddingY: "lg",
          },
        },
        {
          type: "footer",
          orderIndex: 2,
          isVisible: true,
          content: {
            brandName: name,
            tagline: `Professional solutions built for ${audience}.`,
            copyrightText: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
          },
          styles: {
            backgroundColor: "#102A56",
            textColor: "#EFF6FF",
            accentColor: primaryColor,
            textAlign: "left",
            paddingY: "md",
          },
        },
      ],
    });
  }

  return {
    themeConfig: {
      primaryColor,
      fontFamily: "Inter",
      borderRadius: "md",
    },
    pages,
  };
}
