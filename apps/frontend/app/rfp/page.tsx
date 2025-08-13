"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Metadata } from "next";
import { copy } from "@/copy";

export const metadata: Metadata = {
  title: `${copy.rfp.title} - Drone Depot`,
  description: copy.rfp.description,
};

interface FormState {
  name: string;
  organization: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  budgetRange: string;
  dueDate: string;
  description: string;
  file?: File | null;
  consent: boolean;
}

export default function Page() {
  const params = useSearchParams();
  const [form, setForm] = useState<FormState>({
    name: "",
    organization: "",
    email: "",
    phone: "",
    city: "",
    projectType: "",
    budgetRange: "",
    dueDate: "",
    description: "",
    file: null,
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as any;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    ["name", "email", "phone", "city", "projectType", "budgetRange", "dueDate", "description"].forEach((field) => {
      if (!(form as any)[field]) errs[field] = "Required";
    });
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.consent) errs.consent = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      file: undefined,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rfp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "rfp_submit" });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <main className="p-8">
        <h1 className="text-4xl font-bold">{copy.rfp.title}</h1>
        <p className="mt-4">Thanks! We'll be in touch shortly.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{copy.rfp.title}</h1>
      <form onSubmit={handleSubmit} className="mt-4 flex max-w-xl flex-col gap-4">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2" />
        {errors.name && <span className="text-red-600">{errors.name}</span>}
        <input name="organization" placeholder="Organization" value={form.organization} onChange={handleChange} className="border p-2" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2" />
        {errors.email && <span className="text-red-600">{errors.email}</span>}
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2" />
        <input name="city" placeholder="City/County" value={form.city} onChange={handleChange} className="border p-2" />
        <select name="projectType" value={form.projectType} onChange={handleChange} className="border p-2">
          <option value="">Select project type</option>
          <option value="inspection">Inspection</option>
          <option value="mapping">Mapping</option>
          <option value="fpv">FPV</option>
          <option value="construction">Construction Progress</option>
        </select>
        {errors.projectType && <span className="text-red-600">{errors.projectType}</span>}
        <input name="budgetRange" placeholder="Budget" value={form.budgetRange} onChange={handleChange} className="border p-2" />
        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="border p-2" />
        <textarea name="description" placeholder="Project description" value={form.description} onChange={handleChange} className="border p-2" />
        {errors.description && <span className="text-red-600">{errors.description}</span>}
        <input name="file" type="file" onChange={handleChange} />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
          I consent to having this data processed.
        </label>
        {errors.consent && <span className="text-red-600">{errors.consent}</span>}
        <button type="submit" className="rounded bg-brand-purple px-4 py-2 text-white">Submit</button>
      </form>
    </main>
  );
}
