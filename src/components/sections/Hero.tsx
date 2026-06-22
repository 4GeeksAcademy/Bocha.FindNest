import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Find Your Perfect Place
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover homes, apartments and rentals tailored to your lifestyle.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Input placeholder="City, neighborhood or ZIP…" className="w-72" />
          <Button>Search</Button>
        </div>
      </div>
    </section>
  );
}
