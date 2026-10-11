import { useCallback, useState } from "react";
import type { FC } from "react";
import { Maximize2 } from "lucide-react";
import Lightbox from "~components/Lightbox";
import type { VehicleConfig, VehicleReference } from "~features/vehicles/types";
interface ConfigurationProps {
  config: VehicleConfig;
  assigned: string;
  images?: VehicleReference[];
}
const Configuration: FC<ConfigurationProps> = ({
  config,
  assigned,
  images,
}) => {
  const [image, setImage] = useState<VehicleReference | null>(null);
  const close = useCallback((): void => setImage(null), []);
  const blocks = [
    {
      title: "Lightbar / main lights",
      items: [config.lightbar ?? "Visor Lights / Legacy Lightbar"],
    },
    { title: "Required lighting", items: config.requiredLighting },
    { title: "Optional lighting", items: config.optionalLighting },
    { title: "Required accessories", items: config.requiredAccessories },
    { title: "Optional accessories", items: config.optionalAccessories },
    { title: "Allowed decals", items: config.decals },
    { title: "Antennas", items: config.antennas },
    { title: "Notes", items: config.notes },
  ];
  return (
    <>
      <div className="configuration-heading">
        <div>
          <h2>{config.name}</h2>
          <p>Assigned at {assigned}</p>
        </div>
      </div>
      {config.showWarning && (
        <div className="certification-note">
          REQUIRES CERTIFICATION · Complete the relevant certification before
          use.
        </div>
      )}
      <div className="config-grid">
        {blocks
          .filter(
            (block) =>
              block.items?.length &&
              (!config.placeholder || block.title === "Allowed decals"),
          )
          .map((block) => (
            <section className="config-block" key={block.title}>
              <h3>{block.title}</h3>
              <ul>
                {block.items?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
      </div>
      {images && (
        <section className="vehicle-gallery">
          <div className="section-top">
            <div>
              <h3>Correctly configured.</h3>
            </div>
            <span className="muted">Select an image to enlarge</span>
          </div>
          <div className="vehicle-images">
            {images.map((reference) => (
              <figure key={reference.label}>
                {reference.available ? (
                  <button
                    onClick={(): void => setImage(reference)}
                    aria-label={`Enlarge ${reference.label.toLowerCase()} view of ${config.name}`}
                  >
                    <img
                      src={reference.src}
                      alt={`${config.name} — ${reference.label.toLowerCase()} view`}
                      loading="lazy"
                      width="640"
                      height="360"
                    />
                    <Maximize2 size={18} />
                  </button>
                ) : (
                  <div className="reference-missing">
                    Reference image unavailable
                  </div>
                )}
                <figcaption>{reference.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {image && (
        <Lightbox
          src={image.src}
          caption={`${config.name} / ${image.label} VIEW`}
          onClose={close}
        />
      )}
    </>
  );
};
export default Configuration;
