"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { createProject } from "../action";
import { type PackageType } from "@prisma/client";
import Icons from "~/components/shared/icons";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  packageType: z.enum(["SHORT", "FULL", "CREDITS"]),
  wherePlayed: z.string().optional(),
  stakes: z.string().optional(),
  yourHand: z.string().optional(),
  opponentHand: z.string().optional(),
  flop: z.string().optional(),
  turn: z.string().optional(),
  river: z.string().optional(),
  voiceoverUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface PokerPackage {
  id: PackageType;
  name: string;
  description: string;
  price: number;
  credits: number;
  features: string[];
}

interface NewProjectFormProps {
  packages: PokerPackage[];
}

export default function NewProjectForm({ packages }: NewProjectFormProps) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PokerPackage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      packageType: "SHORT",
      wherePlayed: "",
      stakes: "",
      yourHand: "",
      opponentHand: "",
      flop: "",
      turn: "",
      river: "",
      voiceoverUrl: "",
      videoUrl: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createProject(data);
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePackageSelect = (packageType: PackageType) => {
    const pkg = packages.find(p => p.id === packageType);
    setSelectedPackage(pkg || null);
    form.setValue("packageType", packageType);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Package Selection */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Choose Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                  selectedPackage?.id === pkg.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{pkg.name}</h3>
                  <Badge variant="outline">${pkg.price / 100}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                <ul className="space-y-1 text-xs">
                  {pkg.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Icons.check className="h-3 w-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Project Form */}
      <div className="lg:col-span-2">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g., My Big Bluff Hand"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="wherePlayed">Where You Played</Label>
                  <Input
                    id="wherePlayed"
                    {...form.register("wherePlayed")}
                    placeholder="e.g., PokerStars, Live Casino"
                  />
                </div>
                <div>
                  <Label htmlFor="stakes">Stakes</Label>
                  <Input
                    id="stakes"
                    {...form.register("stakes")}
                    placeholder="e.g., $1/$2, $5/$10"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="yourHand">Your Hand</Label>
                  <Input
                    id="yourHand"
                    {...form.register("yourHand")}
                    placeholder="e.g., A♠ K♠"
                  />
                </div>
                <div>
                  <Label htmlFor="opponentHand">Opponent's Hand</Label>
                  <Input
                    id="opponentHand"
                    {...form.register("opponentHand")}
                    placeholder="e.g., Q♣ Q♦"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="flop">Flop</Label>
                  <Input
                    id="flop"
                    {...form.register("flop")}
                    placeholder="e.g., A♣ 7♠ 2♥"
                  />
                </div>
                <div>
                  <Label htmlFor="turn">Turn</Label>
                  <Input
                    id="turn"
                    {...form.register("turn")}
                    placeholder="e.g., K♦"
                  />
                </div>
                <div>
                  <Label htmlFor="river">River</Label>
                  <Input
                    id="river"
                    {...form.register("river")}
                    placeholder="e.g., 9♠"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="voiceoverUrl">Voiceover URL (Optional)</Label>
                <Input
                  id="voiceoverUrl"
                  {...form.register("voiceoverUrl")}
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your voiceover to Google Drive, Dropbox, or similar and paste the link here.
                </p>
              </div>

              <div>
                <Label htmlFor="videoUrl">Raw Video URL (Optional)</Label>
                <Input
                  id="videoUrl"
                  {...form.register("videoUrl")}
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your raw footage to Google Drive, Dropbox, or similar and paste the link here.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              This project will be saved as a draft and expire in 24 hours if not submitted.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/projects")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
