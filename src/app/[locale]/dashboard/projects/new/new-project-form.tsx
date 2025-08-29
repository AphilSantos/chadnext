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
import { MultiCardSelector } from "~/components/ui/multi-card-selector";
import { CardSelector } from "~/components/ui/card-selector";
import { CardListDisplay } from "~/components/ui/card-display";
import { type Card as CardType } from "~/lib/card-deck";
import DualFileUpload from "~/components/ui/dual-file-upload";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  packageType: z.enum(["SHORT", "FULL", "CREDITS"]),
  wherePlayed: z.string().optional(),
  stakes: z.string().optional(),
  yourHand: z.array(z.any()).min(2, "Please select exactly 2 cards").max(2, "Please select exactly 2 cards"),
  opponentHand: z.array(z.any()).min(2, "Please select exactly 2 cards").max(2, "Please select exactly 2 cards"),
  flop: z.array(z.any()).min(3, "Please select exactly 3 cards").max(3, "Please select exactly 3 cards"),
  turn: z.any().optional(),
  river: z.any().optional(),
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
      yourHand: [],
      opponentHand: [],
      flop: [],
      turn: undefined,
      river: undefined,
      voiceoverUrl: "",
      videoUrl: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Convert card arrays to strings for the API
      const formattedData = {
        ...data,
        yourHand: data.yourHand.map(card => `${card.value}${card.symbol}`).join(' '),
        opponentHand: data.opponentHand.map(card => `${card.value}${card.symbol}`).join(' '),
        flop: data.flop.map(card => `${card.value}${card.symbol}`).join(' '),
        turn: data.turn ? `${data.turn.value}${data.turn.symbol}` : '',
        river: data.river ? `${data.river.value}${data.river.symbol}` : '',
      };
      
      await createProject(formattedData);
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

  // Get all selected cards to exclude from other selectors
  const getAllSelectedCards = () => {
    const yourHand = form.watch("yourHand") || [];
    const opponentHand = form.watch("opponentHand") || [];
    const flop = form.watch("flop") || [];
    const turn = form.watch("turn");
    const river = form.watch("river");
    
    return [
      ...yourHand,
      ...opponentHand,
      ...flop,
      ...(turn ? [turn] : []),
      ...(river ? [river] : []),
    ];
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
                  <Label htmlFor="yourHand">Your Hand *</Label>
                  <MultiCardSelector
                    selectedCards={form.watch("yourHand") || []}
                    onCardsChange={(cards) => form.setValue("yourHand", cards)}
                    maxCards={2}
                    placeholder="Select your 2 cards..."
                  />
                  {form.formState.errors.yourHand && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.yourHand.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="opponentHand">Opponent&apos;s Hand *</Label>
                  <MultiCardSelector
                    selectedCards={form.watch("opponentHand") || []}
                    onCardsChange={(cards) => form.setValue("opponentHand", cards)}
                    maxCards={2}
                    placeholder="Select opponent's 2 cards..."
                  />
                  {form.formState.errors.opponentHand && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.opponentHand.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="flop">Flop *</Label>
                  <MultiCardSelector
                    selectedCards={form.watch("flop") || []}
                    onCardsChange={(cards) => form.setValue("flop", cards)}
                    maxCards={3}
                    placeholder="Select 3 flop cards..."
                  />
                  {form.formState.errors.flop && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.flop.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="turn">Turn</Label>
                  <CardSelector
                    selectedCard={form.watch("turn")}
                    onCardSelect={(card) => form.setValue("turn", card)}
                    placeholder="Select turn card..."
                  />
                </div>
                <div>
                  <Label htmlFor="river">River</Label>
                  <CardSelector
                    selectedCard={form.watch("river")}
                    onCardSelect={(card) => form.setValue("river", card)}
                    placeholder="Select river card..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <DualFileUpload
                label="Voiceover (Optional)"
                placeholder="https://drive.google.com/..."
                description="Upload your voiceover file directly or paste a link from Google Drive, Dropbox, or similar."
                acceptedFileTypes={["audio/*"]}
                maxFileSize="50MB"
                maxFileCount={1}
                value={form.watch("voiceoverUrl") || ""}
                onChange={(value) => form.setValue("voiceoverUrl", value)}
                uploadRoute="audioUploader"
              />

              <DualFileUpload
                label="Raw Video (Optional)"
                placeholder="https://drive.google.com/..."
                description="Upload your raw footage file directly or paste a link from Google Drive, Dropbox, or similar."
                acceptedFileTypes={["video/*"]}
                maxFileSize="100MB"
                maxFileCount={1}
                value={form.watch("videoUrl") || ""}
                onChange={(value) => form.setValue("videoUrl", value)}
                uploadRoute="videoUploader"
              />
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
