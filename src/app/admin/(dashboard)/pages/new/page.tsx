import { PageForm } from "../page-form";

export default function NewPagePage() {
  return (
    <div>
      <h1 className="heading-2 text-foreground">New page</h1>
      <div className="mt-8">
        <PageForm />
      </div>
    </div>
  );
}
