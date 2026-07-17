import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-24">
      <Loader size="lg" fullScreen label="Loading the reel…" />
    </div>
  );
}
