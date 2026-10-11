import { useCallback, useMemo, useState } from "react";
import type { FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import PageHeading from "~components/PageHeading";
import Lightbox from "~components/Lightbox";
import { mediaApi } from "~features/media/api/mediaApi";
import type { MediaEntry } from "~features/media/types";
const MediaPage: FC = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["gallery"],
    queryFn: mediaApi.get,
  });
  const sorted = useMemo(
    () => data.toSorted((a, b) => b.date.localeCompare(a.date)),
    [data],
  );
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState<MediaEntry | null>(null);
  const image = sorted[index];
  const next = useCallback(
    (): void => setIndex((i) => (i + 1) % sorted.length),
    [sorted.length],
  );
  const previous = useCallback(
    (): void => setIndex((i) => (i - 1 + sorted.length) % sorted.length),
    [sorted.length],
  );
  const close = useCallback((): void => setExpanded(null), []);
  const expand = useCallback((): void => setExpanded(image ?? null), [image]);
  return (
    <div className="section-shell">
      <PageHeading
        title="Official media"
        description="Official Ghost Unit operations, events, and departmental moments. The latest media is featured first."
      ></PageHeading>
      {image && (
        <section className="featured-media">
          <figure>
            <button
              className="featured-image"
              aria-label={`Enlarge ${image.caption}`}
              onClick={expand}
            >
              <img
                src={image.src}
                alt={
                  image.caption === "Untitled"
                    ? `Ghost Unit operation photographed by ${image.credit}`
                    : image.caption
                }
                width="1600"
                height="900"
              />
              <span className="featured-expand">
                <Maximize2 size={18} />
              </span>
            </button>
            <figcaption>
              <div>
                <h2>{image.caption}</h2>
                <p>Photography / {image.credit}</p>
              </div>
              <div className="carousel-controls">
                <button
                  className="icon-button"
                  aria-label="Previous photograph"
                  onClick={previous}
                >
                  <ArrowLeft size={20} />
                </button>
                <span aria-live="polite">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(sorted.length).padStart(2, "0")}
                </span>
                <button
                  className="icon-button"
                  aria-label="Next photograph"
                  onClick={next}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </figcaption>
          </figure>
        </section>
      )}
      <div className="media-archive-title">
        <h2>The archive</h2>
      </div>
      <div className="media-grid">
        {sorted.map((entry, i) => (
          <figure key={entry.id}>
            <button
              onClick={(): void => {
                setExpanded(entry);
              }}
              aria-label={`View photograph ${i + 1}: ${entry.caption}`}
            >
              <img
                src={entry.src}
                alt={
                  entry.caption === "Untitled"
                    ? `Ghost Unit operation photographed by ${entry.credit}`
                    : entry.caption
                }
                loading="lazy"
                width="640"
                height="400"
              />
              <span>
                <Maximize2 size={19} />
              </span>
            </button>
            <figcaption>
              <span className="media-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{entry.caption}</h3>
                <p>{entry.credit}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {expanded && (
        <Lightbox
          src={expanded.src}
          caption={expanded.caption}
          credit={expanded.credit}
          onClose={close}
        />
      )}
    </div>
  );
};
export default MediaPage;
