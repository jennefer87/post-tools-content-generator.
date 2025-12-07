export interface CarouselContent {
  slide_1: string;
  slide_2: string;
  slide_3: string;
  slide_4: string;
  slide_5: string;
  cta_slide: string;
}

export interface CopyContent {
  full_text: string;
  carousel: CarouselContent;
  reels_script: string;
  feed_version: string;
}

export interface DesignGuide {
  palette: string;
  typography: string;
  layout: string;
  brand_alignment: string;
}

export interface FormatVariations {
  feed: string;
  reels_story: string;
  thumbnail: string;
}

export interface ContentPackage {
  headline: string;
  copy: CopyContent;
  cta: string;
  design_guide: DesignGuide;
  image_prompt: string;
  format_variations: FormatVariations;
}

export interface UserInput {
  niche: string;
  format: string;
  topic: string;
  style: string;
  image: File | null;
}

export enum SocialFormat {
  FEED = "Feed Post",
  CAROUSEL = "Carousel",
  REELS = "Reels/TikTok",
  STORY = "Story",
  LINKEDIN = "LinkedIn Article",
  PINTEREST = "Pinterest Pin",
  THUMBNAIL = "YouTube Thumbnail"
}