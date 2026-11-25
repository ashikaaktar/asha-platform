import { SectionData, SectionType } from "./types";

export const BRAND_COLORS = {
  navy: "#08071F",
  primary: "#8B35FF",
  softBlue: "#191638",
  bg: "#08071F",
  softGray: "#24164A",
  dark: "#D5D2E5",
  cyan: "#38BDF8",
  green: "#20A887",
  border: "#24164A",
  white: "#FFFFFF",
  bright: "#A855F7",
  sky: "#38BDF8",
  light: "#191638",
  purple: "#8B35FF",
  violet: "#C084FC",
  electricBlue: "#176BFF",
  success: "#20A887",
  warning: "#D97706",
  error: "#DC2626",
};

export const TEMPLATE_CATEGORIES = [
  "All",
  "Business",
  "Portfolio",
  "Agency",
  "Personal Website",
  "Blog",
  "Landing Page",
  "Online Store",
] as const;

export const DEFAULT_SECTION_TEMPLATES: Record<SectionType, { content: any; styles: any }> = {
  hero: {
    content: {
      badge: "🚀 Welcome to the Future",
      heading: "Build and Scale Your Vision Without Limits",
      subheading:
        "Empower your business with cutting-edge tools, seamless workflows, and stunning design created in minutes.",
      primaryButtonText: "Get Started Now",
      primaryButtonLink: "#contact",
      secondaryButtonText: "Explore Features",
      secondaryButtonLink: "#features",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Modern platform dashboard showcase",
    },
    styles: {
      backgroundColor: "#FFFFFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "left",
      paddingY: "lg",
    },
  },
  about: {
    content: {
      badge: "About Our Mission",
      heading: "We Help Teams and Creators Deliver Exceptional Results",
      description:
        "Founded on the principle of simplicity and power, we believe anyone can build high-impact digital experiences without complex code. Our platform unites design excellence with rock-solid infrastructure.",
      bulletPoints: [
        "Trusted by over 10,000+ ambitious creators and companies worldwide",
        "Lightning-fast performance and 99.99% uptime guarantee",
        "Dedicated customer success team ready 24/7 to support your growth",
      ],
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
      statNumber: "99.9%",
      statLabel: "Satisfaction Rate",
    },
    styles: {
      backgroundColor: "#F7FAFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "left",
      paddingY: "lg",
    },
  },
  features: {
    content: {
      badge: "Core Capabilities",
      heading: "Everything You Need to Succeed Online",
      subheading: "Powerful features designed to help your brand shine and convert visitors into loyal customers.",
      features: [
        {
          icon: "Zap",
          title: "AI-Powered Generation",
          description: "Generate complete, responsive websites from simple descriptive prompts in seconds.",
        },
        {
          icon: "Layout",
          title: "Drag & Drop Visual Editor",
          description: "Customize every heading, section, color, and image intuitively without writing code.",
        },
        {
          icon: "Globe",
          title: "Instant One-Click Publishing",
          description: "Go live immediately on high-speed global subdomains with automated SSL and asset routing.",
        },
        {
          icon: "Smartphone",
          title: "Fully Responsive by Default",
          description: "Look pixel-perfect across iPhones, iPads, Android devices, laptops, and ultra-wide screens.",
        },
        {
          icon: "BarChart3",
          title: "Built-In Real Analytics",
          description: "Track live page views, top referrers, and audience growth with clean privacy-first tracking.",
        },
        {
          icon: "ShieldCheck",
          title: "Enterprise Grade Security",
          description: "Automatic HTTPS encryption, protected storage isolation, and continuous uptime monitoring.",
        },
      ],
    },
    styles: {
      backgroundColor: "#FFFFFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "center",
      paddingY: "lg",
    },
  },
  services: {
    content: {
      badge: "What We Offer",
      heading: "Tailored Solutions for Modern Demands",
      subheading: "Explore our flexible service tiers designed to accelerate your growth.",
      services: [
        {
          title: "Digital Strategy & Consulting",
          description: "Comprehensive audits and roadmaps to optimize your digital presence and market reach.",
          price: "Starting at $499",
          icon: "Compass",
        },
        {
          title: "Custom Brand & Web Design",
          description: "Bespoke digital identities and high-converting websites tailored to your unique audience.",
          price: "Starting at $1,200",
          icon: "Palette",
        },
        {
          title: "Growth & Search Optimization",
          description: "Technical SEO, content architecture, and conversion rate optimization that drives results.",
          price: "Starting at $799/mo",
          icon: "TrendingUp",
        },
      ],
    },
    styles: {
      backgroundColor: "#F7FAFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "center",
      paddingY: "lg",
    },
  },
  gallery: {
    content: {
      badge: "Our Work",
      heading: "Featured Showcase & Recent Projects",
      subheading: "A visual glimpse into the creative work and experiences we have brought to life.",
      items: [
        {
          imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
          title: "Fintech Dashboard System",
          category: "Web Application",
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
          title: "Minimalist Studio Brand",
          category: "Branding",
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          title: "Analytics SaaS Platform",
          category: "Product Design",
        },
      ],
    },
    styles: {
      backgroundColor: "#FFFFFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "center",
      paddingY: "lg",
    },
  },
  testimonials: {
    content: {
      badge: "Real Customer Stories",
      heading: "Loved by Founders and Creators",
      subheading: "See how forward-thinking teams are launching their web presence in record time.",
      testimonials: [
        {
          quote:
            "ASHA made it possible for us to launch our entire company website in an afternoon. The AI draft was amazingly close to what we envisioned, and customizing it was a breeze.",
          author: "Elena Rostova",
          role: "Founder, Zenith Media",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        },
        {
          quote:
            "As an independent consultant, I needed a clean, authoritative website without paying thousands of dollars to agencies. ASHA gave me complete control and instant publishing.",
          author: "David Vance",
          role: "Principal, Vance Advisory Group",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        },
      ],
    },
    styles: {
      backgroundColor: "#F7FAFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "center",
      paddingY: "lg",
    },
  },
  faq: {
    content: {
      badge: "Common Questions",
      heading: "Frequently Asked Questions",
      subheading: "Everything you need to know about building, customizing, and publishing your website.",
      items: [
        {
          question: "Can I edit everything after the AI generates the website?",
          answer:
            "Yes, 100%! Every heading, paragraph, button, image, color, font, and section can be visually edited or reorganized using our intuitive visual editor.",
        },
        {
          question: "How does publishing on ASHA subdomains work?",
          answer:
            "When you click Publish, your site is assigned your chosen subdomain (e.g., yourname.asha.site) and instantly routed globally with SSL encryption enabled.",
        },
        {
          question: "Can I add multiple pages to my website?",
          answer:
            "Yes! You can add pages such as About, Services, Contact, or Blog, organize their order, designate your homepage, and customize each page independently.",
        },
        {
          question: "Is there any coding required?",
          answer:
            "No coding whatsoever. The platform is built specifically for founders, freelancers, creators, and business owners who want professional results fast.",
        },
      ],
    },
    styles: {
      backgroundColor: "#FFFFFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "center",
      paddingY: "lg",
    },
  },
  contact: {
    content: {
      badge: "Get In Touch",
      heading: "Let's Start Building Something Great Together",
      subheading: "Have questions or need assistance? Reach out to our team or send us a message below.",
      email: "hello@asha.site",
      phone: "+1 (800) 555-ASHA",
      address: "100 Innovation Way, Suite 400, San Francisco, CA",
      formButtonText: "Send Message",
    },
    styles: {
      backgroundColor: "#F7FAFF",
      textColor: "#102A56",
      accentColor: "#2563EB",
      textAlign: "center",
      paddingY: "lg",
    },
  },
  cta: {
    content: {
      heading: "Ready to Launch Your Professional Website?",
      subheading: "Join thousands of creators who build, customize, and publish their digital ideas with ASHA.",
      buttonText: "Start Building Now — It's Free",
      buttonLink: "/register",
    },
    styles: {
      backgroundColor: "#102A56",
      textColor: "#FFFFFF",
      accentColor: "#38BDF8",
      textAlign: "center",
      paddingY: "xl",
    },
  },
  footer: {
    content: {
      brandName: "ASHA",
      tagline: "The Modern AI-Powered Website Builder & Publishing Platform.",
      copyrightText: "© 2026 ASHA Platform. All rights reserved.",
      links: [
        { label: "Home", url: "/" },
        { label: "Templates", url: "/templates" },
        { label: "Features", url: "/#features" },
        { label: "Pricing", url: "/#pricing" },
        { label: "Contact", url: "/#contact" },
      ],
    },
    styles: {
      backgroundColor: "#102A56",
      textColor: "#EFF6FF",
      accentColor: "#38BDF8",
      textAlign: "left",
      paddingY: "md",
    },
  },
};
