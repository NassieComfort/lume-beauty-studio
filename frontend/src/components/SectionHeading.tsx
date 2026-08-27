interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow mb-4">{eyebrow}</p>

      <h2 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 leading-7 text-lume-cream/60">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;