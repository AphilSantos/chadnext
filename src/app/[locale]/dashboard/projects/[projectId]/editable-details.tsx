"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "~/hooks/use-toast";
import { updateProjectById } from "../action";
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
  const formValues = convertProjectToFormValues(initialValues);
  
  const form = useForm<PokerProjectFormValues>({
    resolver: zodResolver(pokerProjectSchema),
    values: formValues,
  });

  async function onSubmit(values: PokerProjectFormValues) {
    try {
      await updateProjectById(initialValues.id, values);
      toast({
        title: "Project Updated successfully.",
      });
      form.reset();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error updating project.",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-6">
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
              <FormLabel>Opponent's Hand (if known)</FormLabel>
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
  );
}
