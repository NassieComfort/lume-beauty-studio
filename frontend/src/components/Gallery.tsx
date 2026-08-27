import classicSet from "../assets/public/classic-set - .jpg";
import hybridSet from "../assets/public/hybrid-set.jpg";
import volumeSet from "../assets/public/volume-set.jpg";
import megaVolumeSet from "../assets/public/mega-volume-set.jpg";

const images = [classicSet, hybridSet, volumeSet, megaVolumeSet];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-lume-charcoal px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
              The Lume look
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Soft. Defined. Intentional.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-lume-grey">
            A glimpse into the details, textures and finishes that define the Lume experience.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Lume lash set ${index + 1}`}
              className="h-[360px] w-full object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}