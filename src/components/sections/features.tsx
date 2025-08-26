import Icons from "../shared/icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Features() {
  const features = [
    {
      icon: Icons.zap,
      title: "Lightning Fast Delivery",
      description:
        "Get your edited poker videos back in 24-48 hours. Perfect for content creators who need quick turnaround.",
    },
    {
      icon: Icons.award,
      title: "Professional Quality",
      description:
        "Hollywood-level editing with dramatic music, smooth transitions, and cinematic effects that make your hands look epic.",
    },
    {
      icon: Icons.upload,
      title: "Easy File Upload",
      description:
        "Simply paste your Google Drive or Dropbox links. No complicated uploads or file size limits to worry about.",
    },
    {
      icon: Icons.messageCircle,
      title: "Direct Editor Chat",
      description:
        "Communicate directly with your assigned editor. Get updates, request changes, and ensure your vision is perfect.",
    },
    {
      icon: Icons.sparkles,
      title: "Custom Branding",
      description:
        "Add your logo, channel name, and personal branding to every video. Build your poker brand with professional content.",
    },
    {
      icon: Icons.check,
      title: "Unlimited Revisions",
      description:
        "Not happy with the first cut? Get unlimited revisions until you're 100% satisfied with your poker video.",
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden py-24">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-10 blur-3xl"></div>
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-10 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container">
        <div className="animate-fade-in-up mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Why Choose Our Poker Editing Service?
          </h2>
          <p className="text-xl text-muted-foreground">
            We turn your raw poker footage into viral-worthy content that grows
            your audience and builds your brand.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="animate-fade-in-up group relative border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:from-gray-900 dark:to-gray-800/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

              <CardHeader className="relative z-10 pb-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold transition-colors duration-300 group-hover:text-green-600">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <p className="leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
