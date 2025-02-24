"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // Here you would typically send the data to your API
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })

      toast.success("Message sent", {
        description: "We'll get back to you as soon as possible.",
      });

      // Reset the form
      event.currentTarget.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Your name"
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="message">Message</label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="How can we help?"
          disabled={isLoading}
          className="min-h-[150px]"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
