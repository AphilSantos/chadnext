import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How long does it take to get my edited video back?",
    answer:
      "Most videos are delivered within 24-48 hours. Short clips (under 5 minutes) are typically ready in 24 hours, while full projects may take up to 48 hours. We'll always communicate the timeline upfront.",
  },
  {
    question: "What file formats do you accept for upload?",
    answer:
      "We accept all major video formats including MP4, MOV, AVI, and more. Simply upload your raw footage to Google Drive, Dropbox, or any cloud storage and paste the link in our form. No file size limits!",
  },
  {
    question: "Can I request changes to my edited video?",
    answer:
      "Absolutely! We offer unlimited revisions until you're 100% satisfied. Whether it's music changes, timing adjustments, or adding effects, we'll work with you to perfect your poker video.",
  },
  {
    question: "Do you add music and sound effects?",
    answer:
      "Yes! We include dramatic background music, sound effects for card shuffles, chip sounds, and other poker-related audio to make your videos more engaging and professional.",
  },
  {
    question: "Can I add my own branding to the videos?",
    answer:
      "Of course! We can add your logo, channel name, social media handles, and any other branding elements you'd like. This helps build your personal poker brand across all your content.",
  },
  {
    question: "What if I'm not happy with the final result?",
    answer:
      "We stand behind our work with a 100% satisfaction guarantee. If you're not completely happy with your video, we'll either revise it until you are, or provide a full refund. Your satisfaction is our priority.",
  },
  {
    question: "Do you edit live poker sessions or just individual hands?",
    answer:
      "We edit both! Whether you have a single epic hand or a full 2-hour live session, we can create compelling content. For longer sessions, we'll create highlight reels and individual hand breakdowns.",
  },
  {
    question: "How do I communicate with my editor?",
    answer:
      "Each project includes a dedicated chat thread where you can communicate directly with your editor. Share feedback, request changes, and get updates on your project progress in real-time.",
  },
];

export default function FAQ() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-5 blur-3xl"></div>
        <div
          className="absolute bottom-1/2 right-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-5 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container">
        <div className="animate-fade-in-up mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our poker video editing service
          </p>
        </div>

        <div
          className="animate-fade-in-up mx-auto w-full max-w-3xl"
          style={{ animationDelay: "0.2s" }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border-b border-border/50 px-4 transition-colors duration-200 hover:bg-muted/20"
              >
                <AccordionTrigger className="py-4 text-left font-semibold transition-colors hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
