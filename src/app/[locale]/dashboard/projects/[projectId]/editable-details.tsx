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

// Poker project schema
const pokerProjectSchema = z.object({
  name: z.string().min(1, { message: "Please enter a project name." }),
  packageType: z.enum(["SHORT", "FULL", "CREDITS"]),
  wherePlayed: z.string().optional(),
  stakes: z.string().optional(),
  yourHand: z.string().optional(),
  opponentHand: z.string().optional(),
  flop: z.string().optional(),
  turn: z.string().optional(),
  river: z.string().optional(),
  voiceoverUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

type PokerProjectFormValues = z.infer<typeof pokerProjectSchema>;

export default function EditableDetails({
  initialValues,
}: {
  initialValues: PokerProjectFormValues & { id: string };
}) {
  const form = useForm<PokerProjectFormValues>({
    resolver: zodResolver(pokerProjectSchema),
    values: initialValues,
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
                <Input placeholder="PokerStars, Live Casino, etc." {...field} />
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
                <Input placeholder="$1/$2, $5/$10, etc." {...field} />
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
                <Input placeholder="A♠ K♠" {...field} />
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
                <Input placeholder="Q♣ Q♦" {...field} />
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
                <Input placeholder="A♣ 7♠ 2♥" {...field} />
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
                <Input placeholder="K♦" {...field} />
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
                <Input placeholder="J♠" {...field} />
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
                <Input placeholder="https://drive.google.com/..." {...field} />
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
                <Input placeholder="https://drive.google.com/..." {...field} />
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
