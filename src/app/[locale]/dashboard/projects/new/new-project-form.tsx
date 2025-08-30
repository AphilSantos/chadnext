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
import MultiFileUpload from "~/components/ui/multi-file-upload";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

// Dynamic schema that will be updated based on number of players
const createFormSchema = (numPlayers: number) => {
  const playerHandsSchema: Record<string, any> = {};
  
  for (let i = 1; i <= numPlayers; i++) {
    playerHandsSchema[`player${i}Hand`] = z.array(z.any()).min(2, `Please select exactly 2 cards for Player ${i}`).max(2, `Please select exactly 2 cards for Player ${i}`);
  }

  return z.object({
    name: z.string().min(1, "Project name is required"),
    packageType: z.enum(["SHORT", "FULL", "CREDITS"]),
    wherePlayed: z.string().optional(),
    stakes: z.string().optional(),
    numPlayers: z.number().min(2, "Minimum 2 players").max(10, "Maximum 10 players"),
    ...playerHandsSchema,
    flop: z.array(z.any()).min(3, "Please select exactly 3 cards").max(3, "Please select exactly 3 cards"),
    turn: z.any().optional(),
    river: z.any().optional(),
    voiceoverUrls: z.array(z.string()).optional(),
    videoUrls: z.array(z.string()).optional(),
    notes: z.string().optional(),
  });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

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
  const [showPlayerCountDialog, setShowPlayerCountDialog] = useState(true);
  const [numPlayers, setNumPlayers] = useState(2);
  const [tempPlayerCount, setTempPlayerCount] = useState(2);

  // Create dynamic schema based on number of players
  const formSchema = createFormSchema(numPlayers);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      packageType: "SHORT",
      wherePlayed: "",
      stakes: "",
      numPlayers: 2,
      player1Hand: [],
      player2Hand: [],
      flop: [],
      turn: undefined,
      river: undefined,
      voiceoverUrls: [],
      videoUrls: [],
      notes: "",
    } as any,
  });

  const handlePlayerCountSubmit = () => {
    setNumPlayers(tempPlayerCount);
    setShowPlayerCountDialog(false);
    
    // Update form schema and reset form with new player count
    const newSchema = createFormSchema(tempPlayerCount);
    form.clearErrors();
    
    // Create new default values with the correct number of player hands
    const newDefaultValues: any = {
      name: form.getValues("name"),
      packageType: form.getValues("packageType"),
      wherePlayed: form.getValues("wherePlayed"),
      stakes: form.getValues("stakes"),
      numPlayers: tempPlayerCount,
      flop: form.getValues("flop") || [],
      turn: form.getValues("turn"),
      river: form.getValues("river"),
      voiceoverUrls: form.getValues("voiceoverUrls") || [],
      videoUrls: form.getValues("videoUrls") || [],
      notes: form.getValues("notes") || "",
    };
    
    // Add player hands for the new count
    for (let i = 1; i <= tempPlayerCount; i++) {
      const fieldName = `player${i}Hand` as keyof FormData;
      newDefaultValues[fieldName] = (form.getValues(fieldName) as CardType[]) || [];
    }
    
    form.reset(newDefaultValues);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Convert card arrays to strings for the API
      const formattedData: any = {
        name: data.name,
        packageType: data.packageType,
        wherePlayed: data.wherePlayed,
        stakes: data.stakes,
        numPlayers: data.numPlayers,
        flop: data.flop.map(card => `${card.value}${card.symbol}`).join(' '),
        turn: data.turn ? `${data.turn.value}${data.turn.symbol}` : '',
        river: data.river ? `${data.river.value}${data.river.symbol}` : '',
        voiceoverUrls: data.voiceoverUrls || [],
        videoUrls: data.videoUrls || [],
        notes: data.notes || '',
      };
      
      // Add player hands as JSON object
      const playerHands: Record<string, string> = {};
      for (let i = 1; i <= data.numPlayers; i++) {
        const fieldName = `player${i}Hand` as keyof FormData;
        const playerHand = data[fieldName] as CardType[];
        playerHands[fieldName] = playerHand.map(card => `${card.value}${card.symbol}`).join(' ');
      }
      formattedData.playerHands = playerHands;
      
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
    const allCards: CardType[] = [];
    
    // Add all player hands
    for (let i = 1; i <= numPlayers; i++) {
      const fieldName = `player${i}Hand` as keyof FormData;
      const playerHand = (form.watch(fieldName) as CardType[]) || [];
      allCards.push(...playerHand);
    }
    
    // Add community cards
    const flop = form.watch("flop") || [];
    const turn = form.watch("turn");
    const river = form.watch("river");
    
    allCards.push(...flop);
    if (turn) allCards.push(turn);
    if (river) allCards.push(river);
    
    return allCards;
  };

  return (
    <>
      {/* Player Count Dialog */}
      <Dialog open={showPlayerCountDialog} onOpenChange={setShowPlayerCountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How many players were in the game?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playerCount">Number of Players</Label>
              <Select value={tempPlayerCount.toString()} onValueChange={(value) => setTempPlayerCount(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of players" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Player' : 'Players'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePlayerCountSubmit}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

                {/* Player Hands Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Player Hands *</Label>
                    <Badge variant="outline">{numPlayers} Players</Badge>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: numPlayers }, (_, i) => i + 1).map((playerNum) => {
                      const fieldName = `player${playerNum}Hand` as keyof FormData;
                      return (
                        <div key={playerNum}>
                          <Label htmlFor={fieldName}>
                            Player {playerNum} Hand *
                          </Label>
                          <MultiCardSelector
                            selectedCards={(form.watch(fieldName) as CardType[]) || []}
                            onCardsChange={(cards) => form.setValue(fieldName, cards)}
                            maxCards={2}
                            placeholder={`Select Player ${playerNum}'s 2 cards...`}
                          />
                          {form.formState.errors[fieldName] && (
                            <p className="text-sm text-red-600 mt-1">
                              {(form.formState.errors[fieldName] as any)?.message}
                            </p>
                          )}
                        </div>
                      );
                    })}
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
                <MultiFileUpload
                  label="Voiceover Files (Optional)"
                  placeholder="https://drive.google.com/..."
                  description="Upload your voiceover files directly or paste links from Google Drive, Dropbox, or similar. You can add multiple files."
                  acceptedFileTypes={["audio/*"]}
                  maxFileSize="50MB"
                  maxFileCount={5}
                  value={form.watch("voiceoverUrls") || []}
                  onChange={(value) => form.setValue("voiceoverUrls", value)}
                  uploadRoute="audioUploader"
                />

                <MultiFileUpload
                  label="Raw Video Files (Optional)"
                  placeholder="https://drive.google.com/..."
                  description="Upload your raw footage files directly or paste links from Google Drive, Dropbox, or similar. You can add multiple files."
                  acceptedFileTypes={["video/*"]}
                  maxFileSize="100MB"
                  maxFileCount={5}
                  value={form.watch("videoUrls") || []}
                  onChange={(value) => form.setValue("videoUrls", value)}
                  uploadRoute="videoUploader"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="notes">Notes for Editors (Optional)</Label>
                  <Textarea
                    id="notes"
                    {...form.register("notes")}
                    placeholder="Provide any additional information, context, or specific instructions for the editors. For example: 'Focus on the bluff on the turn', 'Include commentary about the river decision', 'Add graphics showing pot odds', etc."
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    This information will help our editors understand your vision and create the best possible video for your poker hand.
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
    </>
  );
}
