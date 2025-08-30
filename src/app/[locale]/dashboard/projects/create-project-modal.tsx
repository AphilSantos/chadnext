"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { toast } from "~/hooks/use-toast";
import { FreePlanLimitError } from "~/lib/utils";
import { checkIfFreePlanLimitReached, createProject } from "./action";

// Poker project schema
export const projectSchema = z.object({
  name: z.string().min(1, { message: "Please enter a project name." }),
  packageType: z.enum(["SHORT", "FULL", "CREDITS"]),
  wherePlayed: z.string().nullable(),
  stakes: z.string().nullable(),
  numPlayers: z.number().default(2),
  flop: z.string().nullable(),
  turn: z.string().nullable(),
  river: z.string().nullable(),
  voiceoverUrls: z.array(z.string()).nullable(),
  videoUrls: z.array(z.string()).nullable(),
  notes: z.string().nullable(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      packageType: "SHORT",
      wherePlayed: null,
      stakes: null,
      numPlayers: 2,
      flop: null,
      turn: null,
      river: null,
      voiceoverUrls: null,
      videoUrls: null,
      notes: null,
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      const limitReached = await checkIfFreePlanLimitReached();
      if (limitReached) {
        throw new FreePlanLimitError();
      }
      await createProject(values);
      toast({
        title: "Project created successfully.",
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      if (error instanceof FreePlanLimitError) {
        return toast({
          title: "Free plan limit reached. Please upgrade your plan.",
          variant: "destructive",
        });
      }
      return toast({
        title: "Error creating project. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          role="button"
          className="flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent"
        >
          <Button size="icon" variant="ghost">
            <Icons.add className="h-8 w-8" />
          </Button>
          <p className="text-xl font-medium">Create a new project</p>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Poker Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="packageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SHORT">Short Clip ($100)</SelectItem>
                      <SelectItem value="FULL">Full Project + Shorts ($500)</SelectItem>
                      <SelectItem value="CREDITS">Credits Package ($2000)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="numPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Players</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2" 
                      {...field} 
                      value={field.value || 2}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes for Editors</FormLabel>
                  <FormControl>
                    <Input placeholder="Any special instructions or notes..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
