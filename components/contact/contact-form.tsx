"use client";

import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WEB3FORMS_ACCESS_KEY, WEB3FORMS_HCAPTCHA_SITEKEY } from "@/lib/site/contact-form";

export default function ContactForm() {
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult("");

    if (!captchaToken) {
      setResult("Please complete the captcha before sending.");
      return;
    }

    setSubmitting(true);
    setResult("Sending…");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("h-captcha-response", captchaToken);
    formData.set("subject", "Property Team — website contact form");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { success?: boolean; message?: string };

      if (data.success) {
        setResult("Thank you — your message was sent successfully.");
        form.reset();
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } else {
        setResult(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Send us a message</h2>
      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input id="contact-name" name="name" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="How can we help with property search, agency listings, or support?"
        />
      </div>
      <div className="overflow-hidden rounded-md border bg-card p-1">
        <HCaptcha
          ref={captchaRef}
          sitekey={WEB3FORMS_HCAPTCHA_SITEKEY}
          reCaptchaCompat={false}
          onVerify={setCaptchaToken}
          onExpire={() => setCaptchaToken(null)}
        />
      </div>
      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Submit"}
      </Button>
      {result ? (
        <p
          role="status"
          className={`text-sm ${result.startsWith("Thank") ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}
        >
          {result}
        </p>
      ) : null}
    </form>
  );
}