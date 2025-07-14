"use client"

import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ContactSchema } from "~/types";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function ContactForm() {
  const form = useForm<z.infer<typeof ContactSchema>>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      subject: "",
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-xl">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} type="text" id="name" placeholder="Nom et Prénom" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="email" id="email" placeholder="Email" {...field} />
            </FormControl>
            <FormDescription>
              Cette adresse email sera utilisée pour répondre à votre message
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
        />
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="text" id="subject" placeholder="Sujet" {...field} />
            </FormControl>
            <FormDescription>
              Veuillez renseigner la raison pour laquelle vous souhaitez nous contacter
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tapez votre message ici"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Entrez votre message
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Envoyer </Button>
      </form>
    </Form>
  )
}
