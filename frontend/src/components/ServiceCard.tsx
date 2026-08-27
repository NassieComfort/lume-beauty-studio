type ServiceCardProps = {
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  image?: string;
};

export default function ServiceCard({
  name,
  category,
  description,
  duration,
  price,
  image,
}: ServiceCardProps) {
  return (
    <article className="group border border-lume-charcoal/15 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {image && (
        <img
          src={image}
          alt={name}
          className="mb-6 aspect-[4/3] w-full object-cover"
        />
      )}

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[10px] uppercase tracking-[0.25em] text-lume-grey">
            {category}
          </p>

          <h3 className="mt-3 font-display text-2xl">
            {name}
          </h3>

        </div>

        <span className="whitespace-nowrap text-xs text-lume-grey">
          {duration}
        </span>

      </div>

      <p className="mt-5 min-h-14 text-sm leading-6 text-lume-grey">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between border-t border-lume-charcoal/10 pt-5">

        <span className="font-medium">
          {price}
        </span>

        <span className="text-xs uppercase tracking-wider text-lume-grey">
          Available
        </span>

      </div>

    </article>
  );
}