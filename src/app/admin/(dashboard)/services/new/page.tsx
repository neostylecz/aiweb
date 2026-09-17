import { ServiceForm } from "../service-form";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="heading-2 text-foreground">New service</h1>
      <div className="mt-8">
        <ServiceForm />
      </div>
    </div>
  );
}
