export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-lume-cream/20 border-t-lume-cream" />
    </div>
  );
}