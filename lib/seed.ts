import { prisma } from "./db";
import { hashPassword } from "./auth";
import { DEFAULT_SECTION_TEMPLATES } from "./constants";

export async function runDatabaseSeed() {
  try {
    console.log("Starting database seed...");

    // 1. Seed or update Platform Settings
    const defaultSettings = [
      { key: "platform_name", value: "ASHA" },
      { key: "default_website_limit", value: "5" },
      { key: "default_ai_limit", value: "20" },
      { key: "default_storage_mb", value: "100" },
      { key: "allow_public_registration", value: "true" },
      { key: "subdomain_suffix", value: "asha.site" },
    ];

    for (const s of defaultSettings) {
      await prisma.platformSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value },
      });
    }

    // 2. Seed Super Admin
    const adminEmail = process.env.SUPERADMIN_EMAIL || "admin@asha.site";
    const adminPassword = process.env.SUPERADMIN_PASSWORD || "Admin@Asha2026!";
    const hashedAdminPassword = await hashPassword(adminPassword);

    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: "ADMIN",
        status: "ACTIVE",
      },
      create: {
        name: "Super Administrator",
        email: adminEmail,
        passwordHash: hashedAdminPassword,
        role: "ADMIN",
        status: "ACTIVE",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        planUsage: {
          create: {
            planName: "Super Admin",
            maxWebsites: 999,
            maxAiGenerations: 999,
            maxStorageMb: 5000,
          },
        },
      },
    });

    console.log(`Super Admin ready: ${adminUser.email}`);

    // 3. Seed Demo User
    const demoEmail = "demo@asha.site";
    const demoPassword = await hashPassword("Demo@Asha2026!");

    const demoUser = await prisma.user.upsert({
      where: { email: demoEmail },
      update: {},
      create: {
        name: "Alex Morgan",
        email: demoEmail,
        passwordHash: demoPassword,
        role: "USER",
        status: "ACTIVE",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        planUsage: {
          create: {
            planName: "Pro",
            maxWebsites: 10,
            maxAiGenerations: 50,
            maxStorageMb: 250,
          },
        },
      },
    });

    // 4. Seed Templates for all 7 Categories
    const templateDefs = [
      {
        title: "Apex Global Solutions",
        category: "Business",
        description: "Professional corporate layout for modern enterprises, consulting firms, and B2B services.",
        thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        isFeatured: true,
        pages: [
          {
            title: "Home",
            slug: "home",
            isHomepage: true,
            orderIndex: 0,
            sections: [
              {
                type: "hero",
                content: {
                  badge: "💼 Enterprise Business Solutions",
                  heading: "Driving Sustainable Growth Through Strategic Intelligence",
                  subheading:
                    "We empower global businesses with operational agility, cutting-edge consulting, and high-impact digital transformation.",
                  primaryButtonText: "Consult Our Team",
                  primaryButtonLink: "#contact",
                  secondaryButtonText: "Our Practice Areas",
                  secondaryButtonLink: "#services",
                  imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
                },
                styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              },
              {
                type: "features",
                content: {
                  badge: "Why Work With Us",
                  heading: "Engineered for Corporate Excellence",
                  subheading: "Proven methodologies backed by data science and twenty years of advisory leadership.",
                  features: [
                    { icon: "Shield", title: "Risk Mitigation", description: "Comprehensive frameworks ensuring full governance and compliance." },
                    { icon: "TrendingUp", title: "Revenue Scalability", description: "Unlock sustainable revenue pipelines and expand market share." },
                    { icon: "Users", title: "Executive Alignment", description: "Align leadership vision with cross-functional execution." },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.features.styles,
              },
              {
                type: "contact",
                content: {
                  badge: "Contact Us",
                  heading: "Initiate an Executive Consultation",
                  subheading: "Connect with our principal advisors today to discuss your organizational goals.",
                  email: "executive@apexglobal.example",
                  phone: "+1 (888) 555-APEX",
                  address: "One World Trade Center, Floor 68, New York, NY",
                  formButtonText: "Schedule Discussion",
                },
                styles: DEFAULT_SECTION_TEMPLATES.contact.styles,
              },
              {
                type: "footer",
                content: {
                  brandName: "Apex Global",
                  tagline: "Strategic enterprise advisory and operations leadership.",
                  copyrightText: "© 2026 Apex Global Solutions Inc.",
                },
                styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              },
            ],
          },
        ],
      },
      {
        title: "Sophia Vance Studio",
        category: "Portfolio",
        description: "Elegant, minimalist portfolio showcase tailored for visual designers, photographers, and architects.",
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        isFeatured: true,
        pages: [
          {
            title: "Home",
            slug: "home",
            isHomepage: true,
            orderIndex: 0,
            sections: [
              {
                type: "hero",
                content: {
                  badge: "🎨 Visual Designer & Art Director",
                  heading: "Crafting Timeless Brands & Immersive Visual Identities",
                  subheading:
                    "I partner with forward-looking founders to shape memorable aesthetic narratives across digital and print mediums.",
                  primaryButtonText: "View Featured Works",
                  primaryButtonLink: "#gallery",
                  secondaryButtonText: "Get in Touch",
                  secondaryButtonLink: "#contact",
                  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                },
                styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              },
              {
                type: "gallery",
                content: {
                  badge: "Selected Works",
                  heading: "A Curation of Recent Design Projects",
                  subheading: "Explorations in typography, packaging, identity systems, and digital interfaces.",
                  items: [
                    { imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", title: "Minimalist Villa Brand", category: "Architecture" },
                    { imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80", title: "Editorial Lookbook 2026", category: "Fashion" },
                    { imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80", title: "Botanical Skincare Packaging", category: "Packaging" },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.gallery.styles,
              },
              {
                type: "footer",
                content: {
                  brandName: "Sophia Vance",
                  tagline: "Independent Art Direction & Visual Identity Design.",
                  copyrightText: "© 2026 Sophia Vance Studio.",
                },
                styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              },
            ],
          },
        ],
      },
      {
        title: "Nexus Digital Agency",
        category: "Agency",
        description: "High-octane design and engineering agency template built for client acquisition.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        isFeatured: true,
        pages: [
          {
            title: "Home",
            slug: "home",
            isHomepage: true,
            orderIndex: 0,
            sections: [
              {
                type: "hero",
                content: {
                  badge: "⚡ Growth Agency",
                  heading: "We Engineer Hyper-Growth for Venture-Backed Startups",
                  subheading:
                    "From stealth launch to Series B, our multidisciplinary squad accelerates user acquisition and product velocity.",
                  primaryButtonText: "Book a Strategy Call",
                  primaryButtonLink: "#contact",
                  secondaryButtonText: "Explore Services",
                  secondaryButtonLink: "#services",
                  imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
                },
                styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              },
              {
                type: "services",
                content: {
                  badge: "Capabilities",
                  heading: "End-to-End Product & Marketing Acceleration",
                  subheading: "Everything needed to achieve true product-market fit and scale efficiently.",
                  services: [
                    { title: "Rapid MVP Development", description: "Ship production-grade web applications in 4 weeks.", price: "$9,500/mo" },
                    { title: "Paid Acquisition & Funnels", description: "Profitable CAC optimization across Meta, Google & TikTok.", price: "$4,500/mo" },
                    { title: "Brand Identity & Positioning", description: "Distinctive narrative architecture that commands premium pricing.", price: "$6,000" },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.services.styles,
              },
              {
                type: "testimonials",
                content: {
                  badge: "Client Proof",
                  heading: "What Founders Say About Nexus",
                  subheading: "Results that speak louder than pitch decks.",
                  testimonials: [
                    { quote: "Nexus helped us scale from $10k to $150k MRR in under 6 months.", author: "Marcus Zhao", role: "CEO, LayerBase" },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.testimonials.styles,
              },
              {
                type: "footer",
                content: {
                  brandName: "Nexus Agency",
                  tagline: "Growth engineering for high-velocity software startups.",
                  copyrightText: "© 2026 Nexus Growth Partners LLC.",
                },
                styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              },
            ],
          },
        ],
      },
      {
        title: "Dr. Marcus Reed",
        category: "Personal Website",
        description: "Authoritative personal platform for speakers, authors, executives, and thought leaders.",
        thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
        isFeatured: false,
        pages: [
          {
            title: "Home",
            slug: "home",
            isHomepage: true,
            orderIndex: 0,
            sections: [
              {
                type: "hero",
                content: {
                  badge: "🎙️ Keynote Speaker & Bestselling Author",
                  heading: "Rethinking Leadership and Resilience in the Age of AI",
                  subheading:
                    "Inspiring global organizations to navigate technological disruption with empathy, clarity, and bold strategic vision.",
                  primaryButtonText: "Inquire for Speaking",
                  primaryButtonLink: "#contact",
                  secondaryButtonText: "Read Insights",
                  secondaryButtonLink: "#about",
                  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
                },
                styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              },
              {
                type: "about",
                content: {
                  badge: "Biography",
                  heading: "Two Decades Bridging Behavioral Economics & Innovation",
                  description:
                    "Dr. Marcus Reed has delivered keynotes in over 30 countries and authored three internationally acclaimed books on modern executive strategy.",
                  bulletPoints: [
                    "Keynote speaker at World Innovation Summit and Global Tech Forum",
                    "Author of 'The Adaptive Mindset' (over 500,000 copies sold)",
                    "Advisory board member to Fortune 500 technology enterprises",
                  ],
                  statNumber: "300+",
                  statLabel: "Keynotes Delivered Worldwide",
                },
                styles: DEFAULT_SECTION_TEMPLATES.about.styles,
              },
              {
                type: "footer",
                content: {
                  brandName: "Dr. Marcus Reed",
                  tagline: "Thought leadership, keynotes, and executive resilience advisory.",
                  copyrightText: "© 2026 Dr. Marcus Reed.",
                },
                styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              },
            ],
          },
        ],
      },
      {
        title: "TechPulse Modern Insights",
        category: "Blog",
        description: "Engaging editorial blog and newsletter publication for tech analysis and cultural reviews.",
        thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
        isFeatured: false,
        pages: [
          {
            title: "Home",
            slug: "home",
            isHomepage: true,
            orderIndex: 0,
            sections: [
              {
                type: "hero",
                content: {
                  badge: "📰 Daily Tech & Culture Briefing",
                  heading: "Independent Journalism on the Frontier of Technology",
                  subheading:
                    "Deep-dive essays, founder interviews, and honest commentary on artificial intelligence, design, and software culture.",
                  primaryButtonText: "Subscribe Free",
                  primaryButtonLink: "#newsletter",
                  secondaryButtonText: "Latest Essays",
                  secondaryButtonLink: "#features",
                  imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
                },
                styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              },
              {
                type: "features",
                content: {
                  badge: "Featured Coverage",
                  heading: "Top Reads This Week",
                  subheading: "Handcrafted long-form stories written by practicing engineers and venture analysts.",
                  features: [
                    { icon: "Cpu", title: "The Next Architecture Shift", description: "Why local inference models are transforming consumer mobile devices." },
                    { icon: "Compass", title: "The Death of Generic SaaS", description: "How vertical domain expertise is replacing bloated enterprise tools." },
                    { icon: "Bookmark", title: "Building in Public in 2026", description: "Lessons from five bootstrapped founders who reached $5M ARR." },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.features.styles,
              },
              {
                type: "cta",
                content: {
                  heading: "Join 45,000+ Software Leaders",
                  subheading: "Delivered straight to your inbox every Tuesday and Thursday morning. Zero spam, ever.",
                  buttonText: "Join the Newsletter",
                  buttonLink: "#subscribe",
                },
                styles: DEFAULT_SECTION_TEMPLATES.cta.styles,
              },
              {
                type: "footer",
                content: {
                  brandName: "TechPulse Media",
                  tagline: "Critical perspectives on software, venture capital, and human agency.",
                  copyrightText: "© 2026 TechPulse Publishing.",
                },
                styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              },
            ],
          },
        ],
      },
      {
        title: "FlowSaaS AI Platform",
        category: "Landing Page",
        description: "Conversion-optimized product landing page with dynamic feature grids and interactive FAQ.",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        isFeatured: true,
        pages: [
          {
            title: "Home",
            slug: "home",
            isHomepage: true,
            orderIndex: 0,
            sections: [
              {
                type: "hero",
                content: {
                  badge: "⚡ AI-Powered Workflow Orchestration",
                  heading: "Automate Your Repetitive Workflows 10x Faster",
                  subheading:
                    "FlowSaaS connects your customer data, tools, and communication channels into intelligent automated pipelines.",
                  primaryButtonText: "Start 14-Day Free Trial",
                  primaryButtonLink: "#signup",
                  secondaryButtonText: "Watch 2-Min Demo",
                  secondaryButtonLink: "#features",
                  imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
                },
                styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              },
              {
                type: "features",
                content: {
                  badge: "Product Features",
                  heading: "Engineered for Velocity and Reliability",
                  subheading: "Never let manual tasks bottleneck your company's growth again.",
                  features: [
                    { icon: "Layers", title: "Multi-App Integrations", description: "Connect with 500+ SaaS apps seamlessly with zero webhook friction." },
                    { icon: "Clock", title: "Sub-Second Triggering", description: "Event-driven architecture guarantees your automations run without delay." },
                    { icon: "CheckCircle", title: "Enterprise Auditing", description: "Complete visual audit logs and trace histories for every run." },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.features.styles,
              },
              {
                type: "faq",
                content: {
                  badge: "Answers",
                  heading: "Frequently Asked Questions",
                  subheading: "Everything you need to know about setting up and deploying FlowSaaS.",
                  items: [
                    { question: "How long does setup take?", answer: "Most teams are up and running with their first automation pipeline in under 10 minutes." },
                    { question: "Do I need developer skills?", answer: "No coding is required. Our visual builder allows anyone to connect workflows effortlessly." },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.faq.styles,
              },
              {
                type: "footer",
                content: {
                  brandName: "FlowSaaS",
                  tagline: "Automated business intelligence and pipeline orchestration.",
                  copyrightText: "© 2026 FlowSaaS Inc.",
                },
                styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              },
            ],
          },
        ],
      },
      {
        title: "Aura Artisan Goods",
        category: "Online Store",
        description: "Warm, aesthetic e-commerce storefront for handcrafted ceramics, homeware, and lifestyle goods.",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        isFeatured: false,
        pages: [
          {
            title: "Home",
            slug: "home",
            isHomepage: true,
            orderIndex: 0,
            sections: [
              {
                type: "hero",
                content: {
                  badge: "🌿 Handcrafted Homeware & Decor",
                  heading: "Ethically Sourced Living for Mindful Homes",
                  subheading:
                    "Discover heirloom-quality ceramics, natural linen, and bespoke wooden home goods crafted by master artisans.",
                  primaryButtonText: "Explore Collection",
                  primaryButtonLink: "#services",
                  secondaryButtonText: "Our Artisan Story",
                  secondaryButtonLink: "#about",
                  imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
                },
                styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              },
              {
                type: "services",
                content: {
                  badge: "Curated Collections",
                  heading: "Featured Goods of the Season",
                  subheading: "Limited batch artisan creations made with natural and sustainable materials.",
                  services: [
                    { title: "Stone Glaze Ceramic Mug", description: "Hand-thrown stoneware ceramic finished in speckled oatmeal glaze.", price: "$34" },
                    { title: "Pure French Linen Throw", description: "Pre-washed breathable flax linen blanket for effortless living.", price: "$120" },
                    { title: "Carved Walnut Board", description: "Single-piece sustainable black walnut cutting and serving board.", price: "$78" },
                  ],
                },
                styles: DEFAULT_SECTION_TEMPLATES.services.styles,
              },
              {
                type: "footer",
                content: {
                  brandName: "Aura Artisan Goods",
                  tagline: "Mindfully designed objects for serene living spaces.",
                  copyrightText: "© 2026 Aura Goods Co.",
                },
                styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              },
            ],
          },
        ],
      },
    ];

    for (const t of templateDefs) {
      await prisma.template.upsert({
        where: { id: `template-${t.category.toLowerCase().replace(/\s+/g, "-")}` },
        update: {
          title: t.title,
          category: t.category,
          description: t.description,
          thumbnail: t.thumbnail,
          isFeatured: t.isFeatured,
          dataJson: JSON.stringify(t),
        },
        create: {
          id: `template-${t.category.toLowerCase().replace(/\s+/g, "-")}`,
          title: t.title,
          category: t.category,
          description: t.description,
          thumbnail: t.thumbnail,
          isFeatured: t.isFeatured,
          dataJson: JSON.stringify(t),
        },
      });
    }

    console.log("All templates seeded successfully.");

    // 5. Seed a Sample Published Website for demoUser
    const sampleWebsite = await prisma.website.upsert({
      where: { publishedSubdomain: "innovate" },
      update: {},
      create: {
        userId: demoUser.id,
        name: "Innovate AI Studio",
        slug: "innovate-ai-studio",
        description: "Official published website for Innovate AI Studio.",
        category: "Agency",
        status: "PUBLISHED",
        publishedSubdomain: "innovate",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        pages: {
          create: [
            {
              title: "Home",
              slug: "home",
              isHomepage: true,
              orderIndex: 0,
              sections: {
                create: [
                  {
                    type: "hero",
                    orderIndex: 0,
                    contentJson: JSON.stringify({
                      badge: "🚀 Live on ASHA Subdomain",
                      heading: "Innovate AI — Intelligence at Scale",
                      subheading: "Delivering modern AI-powered applications, strategic consulting, and bespoke digital experiences.",
                      primaryButtonText: "Explore Projects",
                      primaryButtonLink: "#services",
                      secondaryButtonText: "Contact Us",
                      secondaryButtonLink: "#contact",
                      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
                    }),
                    stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.hero.styles),
                  },
                  {
                    type: "features",
                    orderIndex: 1,
                    contentJson: JSON.stringify({
                      badge: "Core Pillars",
                      heading: "Built for Transformational Impact",
                      subheading: "We solve the most challenging computational and user experience problems.",
                      features: [
                        { icon: "Cpu", title: "Neural Synthesis", description: "Bespoke generative AI engines trained on proprietary domain datasets." },
                        { icon: "Zap", title: "Ultra-Fast Deployment", description: "Global edge CDN distribution with zero latency overhead." },
                        { icon: "Shield", title: "Enterprise Grade", description: "Full SOC2 compliance readiness and end-to-end data encryption." },
                      ],
                    }),
                    stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.features.styles),
                  },
                  {
                    type: "contact",
                    orderIndex: 2,
                    contentJson: JSON.stringify({
                      badge: "Partner With Us",
                      heading: "Let's Build the Future of AI",
                      subheading: "Reach out to discuss your AI roadmap and implementation.",
                      email: "hello@innovatestudio.example",
                      phone: "+1 (800) 999-INNO",
                      address: "Silicon Valley, CA",
                      formButtonText: "Submit Inquiry",
                    }),
                    stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.contact.styles),
                  },
                  {
                    type: "footer",
                    orderIndex: 3,
                    contentJson: JSON.stringify({
                      brandName: "Innovate AI",
                      tagline: "Pioneering the frontiers of autonomous intelligence.",
                      copyrightText: "© 2026 Innovate AI Studio. Published with ASHA.",
                    }),
                    stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.footer.styles),
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        pages: {
          include: {
            sections: true,
          },
        },
      },
    });

    // Create PublishedSnapshot for sample website
    const snapshotData = {
      websiteId: sampleWebsite.id,
      name: sampleWebsite.name,
      subdomain: "innovate",
      themeConfig: { primaryColor: "#2563EB", fontFamily: "Inter", borderRadius: "md" },
      pages: sampleWebsite.pages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        isHomepage: p.isHomepage,
        orderIndex: p.orderIndex,
        sections: p.sections.map((s) => ({
          id: s.id,
          type: s.type,
          content: JSON.parse(s.contentJson),
          styles: JSON.parse(s.stylesJson),
          orderIndex: s.orderIndex,
          isVisible: s.isVisible,
        })),
      })),
    };

    await prisma.publishedSnapshot.upsert({
      where: { websiteId: sampleWebsite.id },
      update: {
        subdomain: "innovate",
        snapshotJson: JSON.stringify(snapshotData),
      },
      create: {
        websiteId: sampleWebsite.id,
        subdomain: "innovate",
        snapshotJson: JSON.stringify(snapshotData),
      },
    });

    // Also seed a second published website "portfolio" for the acceptance testing requirement:
    // "Test at least two different subdomains and confirm that each displays the correct website."
    const portfolioWebsite = await prisma.website.upsert({
      where: { publishedSubdomain: "portfolio" },
      update: {},
      create: {
        userId: demoUser.id,
        name: "Creative Portfolio Showcase",
        slug: "creative-portfolio-showcase",
        description: "Official published design portfolio showcase.",
        category: "Portfolio",
        status: "PUBLISHED",
        publishedSubdomain: "portfolio",
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        pages: {
          create: [
            {
              title: "Home",
              slug: "home",
              isHomepage: true,
              orderIndex: 0,
              sections: {
                create: [
                  {
                    type: "hero",
                    orderIndex: 0,
                    contentJson: JSON.stringify({
                      badge: "🎨 Visual Portfolio Site",
                      heading: "Selected Design & Architecture Works",
                      subheading: "A distinctive collection of branding, spatial design, and editorial identity.",
                      primaryButtonText: "Explore Projects",
                      primaryButtonLink: "#gallery",
                      secondaryButtonText: "Get in Touch",
                      secondaryButtonLink: "#contact",
                      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80",
                    }),
                    stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.hero.styles),
                  },
                  {
                    type: "gallery",
                    orderIndex: 1,
                    contentJson: JSON.stringify({
                      badge: "Exhibitions & Projects",
                      heading: "Curated Design Artifacts",
                      subheading: "Physical and digital explorations.",
                      items: [
                        { imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", title: "Nordic Pavilion", category: "Spatial" },
                        { imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80", title: "Kinetic Identity", category: "Brand" },
                      ],
                    }),
                    stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.gallery.styles),
                  },
                  {
                    type: "footer",
                    orderIndex: 2,
                    contentJson: JSON.stringify({
                      brandName: "Vance Portfolio",
                      tagline: "Design and spatial architecture.",
                      copyrightText: "© 2026 Sophia Vance. Published with ASHA.",
                    }),
                    stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.footer.styles),
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        pages: {
          include: {
            sections: true,
          },
        },
      },
    });

    const portfolioSnapshotData = {
      websiteId: portfolioWebsite.id,
      name: portfolioWebsite.name,
      subdomain: "portfolio",
      themeConfig: { primaryColor: "#7C3AED", fontFamily: "Inter", borderRadius: "md" },
      pages: portfolioWebsite.pages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        isHomepage: p.isHomepage,
        orderIndex: p.orderIndex,
        sections: p.sections.map((s) => ({
          id: s.id,
          type: s.type,
          content: JSON.parse(s.contentJson),
          styles: JSON.parse(s.stylesJson),
          orderIndex: s.orderIndex,
          isVisible: s.isVisible,
        })),
      })),
    };

    await prisma.publishedSnapshot.upsert({
      where: { websiteId: portfolioWebsite.id },
      update: {
        subdomain: "portfolio",
        snapshotJson: JSON.stringify(portfolioSnapshotData),
      },
      create: {
        websiteId: portfolioWebsite.id,
        subdomain: "portfolio",
        snapshotJson: JSON.stringify(portfolioSnapshotData),
      },
    });

    console.log("Database seed completed successfully!");
  } catch (err) {
    console.error("Database seed error:", err);
  }
}
