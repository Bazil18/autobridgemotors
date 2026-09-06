import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  vehicleId?: string;
  vehicleLabel?: string;
  showSubject?: boolean;
}

export function EnquiryForm({ vehicleId, vehicleLabel, showSubject }: Props) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(
    vehicleLabel ? `I'm interested in the ${vehicleLabel}. Is it still available?` : "",
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);

    const { error } = await supabase.from("enquiries").insert({
      vehicle_id: vehicleId ?? null,
      vehicle_label: vehicleLabel ?? null,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      subject: showSubject ? String(data.get("subject") ?? "") : (vehicleLabel ?? "General"),
      message: String(data.get("message") ?? ""),
    });

    setSending(false);
    if (error) {
      toast.error("Sorry, that didn't send. Please call or WhatsApp us instead.");
      return;
    }
    toast.success("Thanks — we've got your message and will be in touch shortly.");
    form.reset();
    setMessage("");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {showSubject && (
        <div className="grid gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" placeholder="Vehicle you're interested in, or a question" />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" disabled={sending} className="uppercase tracking-widest">
        {sending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
