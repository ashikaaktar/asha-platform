export interface ThemeConfig {
  primaryColor: string;
  fontFamily: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
}

export interface SectionStyles {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  textAlign?: "left" | "center" | "right";
  paddingY?: "sm" | "md" | "lg" | "xl";
  containerWidth?: "narrow" | "normal" | "wide" | "full";
  badgeBgColor?: string;
  badgeTextColor?: string;
}

export interface HeroContent {
  badge?: string;
  heading: string;
  subheading: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface AboutContent {
  badge?: string;
  heading: string;
  description: string;
  bulletPoints?: string[];
  imageUrl?: string;
  statNumber?: string;
  statLabel?: string;
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  badge?: string;
  heading: string;
  subheading?: string;
  features: FeatureItem[];
}

export interface ServiceItem {
  title: string;
  description: string;
  price?: string;
  icon?: string;
}

export interface ServicesContent {
  badge?: string;
  heading: string;
  subheading?: string;
  services: ServiceItem[];
}

export interface GalleryItem {
  imageUrl: string;
  title: string;
  category?: string;
}

export interface GalleryContent {
  badge?: string;
  heading: string;
  subheading?: string;
  items: GalleryItem[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

export interface TestimonialsContent {
  badge?: string;
  heading: string;
  subheading?: string;
  testimonials: TestimonialItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  badge?: string;
  heading: string;
  subheading?: string;
  items: FaqItem[];
}

export interface ContactContent {
  badge?: string;
  heading: string;
  subheading?: string;
  email?: string;
  phone?: string;
  address?: string;
  formButtonText?: string;
}

export interface CtaContent {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
}

export interface FooterContent {
  brandName: string;
  tagline: string;
  copyrightText: string;
  links?: { label: string; url: string }[];
  socials?: { platform: string; url: string }[];
}

export type SectionType =
  | "hero"
  | "about"
  | "features"
  | "services"
  | "gallery"
  | "testimonials"
  | "faq"
  | "contact"
  | "cta"
  | "footer";

export interface SectionData {
  id?: string;
  type: SectionType;
  content: any;
  styles: SectionStyles;
  orderIndex: number;
  isVisible: boolean;
}

export interface PageData {
  id?: string;
  title: string;
  slug: string;
  isHomepage: boolean;
  orderIndex: number;
  sections: SectionData[];
}

export interface WebsiteData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  publishedSubdomain?: string | null;
  themeConfig: ThemeConfig;
  thumbnail?: string | null;
  pages: PageData[];
  createdAt: string;
  updatedAt: string;
}
