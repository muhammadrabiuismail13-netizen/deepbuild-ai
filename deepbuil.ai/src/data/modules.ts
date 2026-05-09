export type Lesson = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
};

export type Module = {
  id: string;
  title: string;
  duration: string;
  category: string;
  thumbnail: string;
  description: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: Lesson[];
};

// Free, public sample MP4s (Big Buck Bunny / Sintel etc.) — used as placeholders
const SAMPLE_VIDEO_1 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_VIDEO_2 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const SAMPLE_VIDEO_3 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const initialModules: Module[] = [
  {
    id: "ai-beginners",
    title: "AI for Beginners",
    duration: "42m",
    category: "Foundations",
    thumbnail: "/images/module-ai-beginners.jpg",
    description:
      "Start from zero and learn how modern AI works — models, prompts, and the tools that are reshaping every industry.",
    instructor: "DeepBuild Team",
    level: "Beginner",
    lessons: [
      {
        id: "l1",
        title: "What is AI, really?",
        duration: "08:24",
        videoUrl: SAMPLE_VIDEO_1,
      },
      {
        id: "l2",
        title: "Prompting fundamentals",
        duration: "12:10",
        videoUrl: SAMPLE_VIDEO_2,
      },
      {
        id: "l3",
        title: "Your first AI workflow",
        duration: "21:30",
        videoUrl: SAMPLE_VIDEO_3,
      },
    ],
  },
  {
    id: "business-with-ai",
    title: "Build a Business with AI",
    duration: "1h 12m",
    category: "Entrepreneurship",
    thumbnail: "/images/module-business-ai.jpg",
    description:
      "Learn how solo founders are launching profitable businesses in weeks using AI for product, marketing, and ops.",
    instructor: "DeepBuild Team",
    level: "Intermediate",
    lessons: [
      {
        id: "l1",
        title: "Finding an AI-native idea",
        duration: "14:02",
        videoUrl: SAMPLE_VIDEO_2,
      },
      {
        id: "l2",
        title: "Building an MVP with AI",
        duration: "26:45",
        videoUrl: SAMPLE_VIDEO_1,
      },
      {
        id: "l3",
        title: "Marketing on autopilot",
        duration: "31:13",
        videoUrl: SAMPLE_VIDEO_3,
      },
    ],
  },
  {
    id: "content-creation",
    title: "Content Creation with AI",
    duration: "55m",
    category: "Creator Studio",
    thumbnail: "/images/module-content-ai.jpg",
    description:
      "Produce high-quality video, writing, and design at 10× speed using the latest generative AI workflows.",
    instructor: "DeepBuild Team",
    level: "Beginner",
    lessons: [
      {
        id: "l1",
        title: "AI writing studio",
        duration: "10:22",
        videoUrl: SAMPLE_VIDEO_3,
      },
      {
        id: "l2",
        title: "Generating viral video",
        duration: "18:50",
        videoUrl: SAMPLE_VIDEO_1,
      },
      {
        id: "l3",
        title: "Brand systems with AI",
        duration: "25:48",
        videoUrl: SAMPLE_VIDEO_2,
      },
    ],
  },
  {
    id: "automation",
    title: "Automate Workflows with AI Agents",
    duration: "38m",
    category: "Productivity",
    thumbnail: "/images/module-ai-beginners.jpg",
    description:
      "Design autonomous agents that run your repetitive work — from email to research to operations.",
    instructor: "DeepBuild Team",
    level: "Advanced",
    lessons: [
      {
        id: "l1",
        title: "Agent architectures",
        duration: "11:30",
        videoUrl: SAMPLE_VIDEO_1,
      },
      {
        id: "l2",
        title: "Tool calling in practice",
        duration: "14:15",
        videoUrl: SAMPLE_VIDEO_2,
      },
      {
        id: "l3",
        title: "Deploying your agent",
        duration: "12:08",
        videoUrl: SAMPLE_VIDEO_3,
      },
    ],
  },
];
