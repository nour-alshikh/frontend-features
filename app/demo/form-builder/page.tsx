import Link from "next/link";
import { FormBuilder } from "@/components/ui/FormBuilder";

export default function FormBuilderDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Form Builder</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Add fields on the left, see the live form on the right.
      </p>
      <FormBuilder />
    </main>
  );
}
