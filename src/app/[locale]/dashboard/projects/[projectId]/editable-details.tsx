"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import CopyButton from "~/components/copy-button";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { toast } from "~/hooks/use-toast";
import { updateProjectById, submitProject, getUserCredits, validateProjectSubmission } from "../action";
import { PackageSelectionModal } from "~/components/ui/package-selection-modal";
import { pokerPackages } from "~/config/subscription";
import * as z from "zod";

// Poker project schema - using nullable fields to match database
const pokerProjectSchema = z.object({
  name: z.string().min(1, { message: "Please enter a project name." }),
  packageType: z.enum(["SHORT", "FULL", "CREDITS"]),
  wherePlayed: z.string().nullable(),
  stakes: z.string().nullable(),
  yourHand: z.string().nullable(),
  opponentHand: z.string().nullable(),
  flop: z.string().nullable(),
  turn: z.string().nullable(),
  river: z.string().nullable(),
  voiceoverUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
});

type PokerProjectFormValues = z.infer<typeof pokerProjectSchema>;

// Type for database project with relations
type ProjectWithRelations = {
  id: string;
  name: string;
  status: string;
  packageType: "SHORT" | "FULL" | "CREDITS";
  userId: string;
  wherePlayed: string | null;
  stakes: string | null;
  yourHand: string | null;
  opponentHand: string | null;
  flop: string | null;
  turn: string | null;
  river: string | null;
  voiceoverUrl: string | null;
  videoUrl: string | null;
  finalVideoUrl: string | null;
  thumbnailUrl: string | null;
  notes: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  messages: any[];
  transaction: any | null;
};

// Convert database project to form values
function convertProjectToFormValues(project: ProjectWithRelations): PokerProjectFormValues & { id: string } {
  return {
    id: project.id,
    name: project.name,
    packageType: project.packageType,
    wherePlayed: project.wherePlayed,
    stakes: project.stakes,
    yourHand: project.yourHand,
    opponentHand: project.opponentHand,
    flop: project.flop,
    turn: project.turn,
    river: project.river,
    voiceoverUrl: project.voiceoverUrl,
    videoUrl: project.videoUrl,
  };
}

export default function EditableDetails({
  initialValues,
}: {
  initialValues: ProjectWithRelations;
}) {
  const [userCredits, setUserCredits] = useState(0);
  const [submissionValidation, setSubmissionValidation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const formValues = convertProjectToFormValues(initialValues);
  
  const form = useForm<PokerProjectFormValues>({
    resolver: zodResolver(pokerProjectSchema),
    values: formValues,
  });

  // Load user credits and validate submission on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const credits = await getUserCredits();
        setUserCredits(credits);
        
        if (initialValues.status === "DRAFT") {
          const validation = await validateProjectSubmission(initialValues.id);
          setSubmissionValidation(validation);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, [initialValues.id, initialValues.status]);

  async function onSubmit(values: PokerProjectFormValues) {
    try {
      await updateProjectById(initialValues.id, values);
      toast({
        title: "Project Updated successfully.",
      });
      
      // Re-validate submission after update
      if (initialValues.status === "DRAFT") {
        setIsValidating(true);
        try {
          const validation = await validateProjectSubmission(initialValues.id);
          setSubmissionValidation(validation);
        } catch (error) {
          console.error("Error validating submission:", error);
        } finally {
          setIsValidating(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error updating project.",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleSubmitProject() {
    if (!submissionValidation?.canSubmit) {
      toast({
        title: "Cannot submit project",
        description: submissionValidation?.error || "Please check your project details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitProject(initialValues.id);
      toast({
        title: "Project submitted successfully!",
        description: "Your project is now in the editing queue.",
      });
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error submitting project",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePackageChange(newPackageType: "SHORT" | "FULL" | "CREDITS") {
    try {
      await updateProjectById(initialValues.id, { packageType: newPackageType });
      toast({
        title: "Package updated successfully.",
      });
      
      // Re-validate submission after package change
      setIsValidating(true);
      try {
        const validation = await validateProjectSubmission(initialValues.id);
        setSubmissionValidation(validation);
      } catch (error) {
        console.error("Error validating submission:", error);
      } finally {
        setIsValidating(false);
      }
    } catch (error) {
      console.error("Error updating package:", error);
      toast({
        title: "Error updating package",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }

  const currentPackage = pokerPackages.find(pkg => pkg.id === form.watch("packageType"));
  const isDraft = initialValues.status === "DRAFT";

  return (
    <div className="space-y-6">
      {/* Project Status and Package Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Project Status</span>
            <Badge variant={isDraft ? "secondary" : "default"}>
              {isDraft ? "Draft" : initialValues.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Package Display */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Current Package</h4>
              <p className="text-sm text-muted-foreground">
                {currentPackage?.name} - {currentPackage?.credits} credits
              </p>
            </div>
            {isDraft && (
              <PackageSelectionModal
                currentPackage={form.watch("packageType")}
                userCredits={userCredits}
                onPackageChange={handlePackageChange}
                trigger={
                  <Button variant="outline" size="sm">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Change Package
                  </Button>
                }
              />
            )}
          </div>

          {/* Credit Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Your Credits</h4>
              <p className="text-sm text-muted-foreground">
                {userCredits} credits available
              </p>
            </div>
            <Badge variant={userCredits > 0 ? "default" : "destructive"}>
              {userCredits} credits
            </Badge>
          </div>

          {/* Submission Validation */}
          {isDraft && submissionValidation && (
            <div className={`p-3 rounded-lg border ${
              submissionValidation.canSubmit 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {submissionValidation.canSubmit ? (
                  <Icons.check className="h-5 w-5 text-green-600" />
                ) : (
                  <Icons.alertCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <h4 className={`font-medium ${
                    submissionValidation.canSubmit ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {submissionValidation.canSubmit 
                      ? `Ready to Submit - ${submissionValidation.packageName}` 
                      : 'Cannot Submit Project'
                    }
                  </h4>
                  <p className={`text-sm ${
                    submissionValidation.canSubmit ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {submissionValidation.canSubmit 
                      ? `Required: ${submissionValidation.requiredCredits} credits | Available: ${submissionValidation.availableCredits} credits`
                      : submissionValidation.error
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button for Drafts */}
          {isDraft && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleSubmitProject}
                disabled={!submissionValidation?.canSubmit || isSubmitting || isValidating}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Project...
                  </>
                ) : isValidating ? (
                  <>
                    <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Icons.send className="mr-2 h-5 w-4" />
                    Submit for Editing
                  </>
                )}
              </Button>
              {!submissionValidation?.canSubmit && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Complete your project details and ensure you have enough credits to submit.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Project ID</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input value={initialValues.id} readOnly disabled />
                    <CopyButton content={initialValues.id} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Poker Hand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wherePlayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where You Played</FormLabel>
                    <FormControl>
                      <Input placeholder="PokerStars, Live Casino, etc." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stakes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stakes</FormLabel>
                    <FormControl>
                      <Input placeholder="$1/$2, $5/$10, etc." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yourHand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Hand</FormLabel>
                    <FormControl>
                      <Input placeholder="A♠ K♠" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="opponentHand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent&apos;s Hand (if known)</FormLabel>
                    <FormControl>
                      <Input placeholder="Q♣ Q♦" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flop</FormLabel>
                    <FormControl>
                      <Input placeholder="A♣ 7♠ 2♥" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="turn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turn</FormLabel>
                    <FormControl>
                      <Input placeholder="K♦" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="river"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>River</FormLabel>
                    <FormControl>
                      <Input placeholder="J♠" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceoverUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voiceover URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://drive.google.com/..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://drive.google.com/..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Icons.spinner className={"mr-2 h-5 w-5 animate-spin"} />
                )}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
