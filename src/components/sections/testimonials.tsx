import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Testimonial {
  name: string;
  title: string;
  quote: string;
  avatar: string; // URL to avatar image
}

// Poker-specific testimonials
const testimonials: Testimonial[] = [
  {
    name: "Mike Johnson",
    title: "Professional Poker Player",
    quote:
      "The editing quality is incredible! My YouTube channel has grown 300% since I started using Poker Edit Pro. The dramatic effects and music make my hands look like they belong on TV.",
    avatar: "/images/avatars/placeholder.png",
  },
  {
    name: "Sarah Chen",
    title: "Poker Content Creator",
    quote:
      "I was spending hours editing my own videos. Now I just upload my footage and get back professional-quality content in 24 hours. It's a game-changer for my content strategy.",
    avatar: "/images/avatars/placeholder.png",
  },
  {
    name: "David Rodriguez",
    title: "Twitch Streamer",
    quote:
      "The team at Poker Edit Pro understands poker content. They know exactly how to highlight the key moments and create engaging clips that my viewers love. Highly recommended!",
    avatar: "/images/avatars/placeholder.png",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="opacity-8 absolute right-1/4 top-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl"></div>
        <div
          className="opacity-8 absolute bottom-1/4 left-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-green-400 to-blue-400 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="container">
        <div className="animate-fade-in-up mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            What Our Players Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of satisfied poker players who've transformed their
            content with our editing service
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="animate-fade-in-up group relative border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:from-gray-900 dark:to-gray-800/50"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-lg font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="transition-colors duration-300 group-hover:text-green-600">
                      {testimonial.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="italic text-muted-foreground transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
