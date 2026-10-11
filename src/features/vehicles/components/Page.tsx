import { useCallback, useMemo, useRef, useState } from "react";
import type { FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import PageHeading from "~components/PageHeading";
import { vehiclesApi } from "~features/vehicles/api/vehiclesApi";
import {
  accessibleVehicles,
  referenceImages,
  resolveVehicle,
} from "~features/vehicles/helpers/vehicleRules";
import type { DivisionId, VehicleConfig } from "~features/vehicles/types";
import Configuration from "./Configuration";
const VehiclesPage: FC = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["vehicles"],
    queryFn: vehiclesApi.get,
  });
  const { data: status } = useSuspenseQuery({
    queryKey: ["vehicle-assets"],
    queryFn: vehiclesApi.assets,
  });
  const [division, setDivision] = useState<DivisionId | null>(null);
  const [rankId, setRankId] = useState("");
  const [carName, setCarName] = useState("");
  const [step, setStep] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const rank = useMemo(
    () => data.ranks.find((r) => r.id === rankId),
    [data, rankId],
  );
  const cars = useMemo(
    () => (rank ? accessibleVehicles(data, rank) : []),
    [data, rank],
  );
  const car = useMemo(
    () => cars.find((c) => c.car.name === carName),
    [cars, carName],
  );
  const guide =
    division && division !== "REGULAR" ? data.separate[division] : null;
  const subRank = guide?.ranks.find((r) => r.name === rankId);
  const subCars =
    guide && subRank
      ? [
          ...new Set(
            guide.ranks
              .slice(0, guide.ranks.indexOf(subRank) + 1)
              .flatMap((r) => r.cars),
          ),
        ]
      : [];
  const config: VehicleConfig | undefined =
    car && division === "REGULAR"
      ? resolveVehicle(data, car)
      : subRank && guide
        ? {
            name: carName,
            lightbar: "Visor Lights / Legacy Lightbar / Valor Lightbar",
            requiredLighting: subRank.lighting,
            requiredAccessories: subRank.accessories.filter(
              (item) => !/optional/i.test(item),
            ),
            optionalAccessories: subRank.accessories.filter((item) =>
              /optional/i.test(item),
            ),
            decals: subRank.decals,
            antennas: guide.antennas,
            notes: [guide.note],
          }
        : undefined;
  const images =
    rank && car ? referenceImages(data, rank, car.car.name, status) : undefined;
  const changeStep = useCallback((next: number): void => {
    setStep(next);
    requestAnimationFrame(() => stage.current?.focus({ preventScroll: true }));
  }, []);
  const selectDivision = useCallback(
    (id: DivisionId): void => {
      setDivision(id);
      setRankId("");
      setCarName("");
      changeStep(2);
    },
    [changeStep],
  );
  const selectRank = useCallback(
    (id: string): void => {
      setRankId(id);
      setCarName("");
      changeStep(3);
    },
    [changeStep],
  );
  const selectCar = useCallback(
    (name: string): void => {
      setCarName(name);
      changeStep(4);
    },
    [changeStep],
  );
  const back = useCallback(
    (): void => changeStep(Math.max(1, step - 1)),
    [step, changeStep],
  );
  return (
    <div className="section-shell">
      <PageHeading
        title="Vehicle guidelines"
        description="The approved fleet and configuration rules for every patrol unit. Higher ranks may use vehicles allowed for lower rank sections."
      />
      <div className="vehicle-document-meta">
        <span>Issued: 10 Jun 2025</span>
        <span>Updated: 25 Aug 2026</span>
        <p>
          Approved by: GU-001 | TheTunaInMe, GU-002 | vigoprosniper, GU-003 |
          ilcolega02, GU-004 | InvasionElectro
        </p>
      </div>
      <div className="vehicle-rule">
        <strong>IF IT ISN’T LISTED, IT ISN’T PERMITTED.</strong>
        <p>
          Only the customization options listed for your vehicle may be used.
          Select your division, rank section, and vehicle to see the exact
          requirements.
        </p>
      </div>
      <div className="stepper" aria-label="Vehicle guide progress">
        {["Division", "Rank section", "Vehicle", "Guidelines"].map(
          (label, i) => (
            <span
              key={label}
              className={
                step === i + 1 ? "current" : step > i + 1 ? "complete" : ""
              }
              aria-current={step === i + 1 ? "step" : undefined}
            >
              <b>0{i + 1}</b>
              {label}
            </span>
          ),
        )}
      </div>
      <div className="vehicle-stage" ref={stage} tabIndex={-1}>
        {step > 1 && (
          <button className="text-link back-button" onClick={back}>
            <ArrowLeft size={17} />
            Back to {["", "divisions", "rank sections", "vehicles"][step - 1]}
          </button>
        )}
        {step === 1 && (
          <>
            <div className="stage-title">
              <h2>Choose a division.</h2>
              <p>Select the division whose vehicle guide you want to view.</p>
            </div>
            <div className="selection-grid divisions-selection">
              {data.divisions.map((d) => (
                <button
                  className="selection-button"
                  onClick={(): void => selectDivision(d.id)}
                  key={d.id}
                >
                  <h3>{d.title}</h3>
                  <p>{d.intro}</p>
                  <ArrowUpRight size={25} />
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="stage-title">
              <h2>Choose your rank.</h2>
              <p>Vehicle access includes the ranks below your selected rank.</p>
            </div>
            <div className="selection-grid">
              {division === "REGULAR"
                ? data.ranks.map((r) => (
                    <button
                      key={r.id}
                      className="selection-button compact"
                      onClick={(): void => selectRank(r.id)}
                    >
                      <h3>{r.title}</h3>
                      <p>{r.intro}</p>
                      <ArrowRight size={21} />
                    </button>
                  ))
                : guide?.ranks.toReversed().map((r) => (
                    <button
                      key={r.name}
                      className="selection-button compact"
                      onClick={(): void => selectRank(r.name)}
                    >
                      <h3>{r.name}</h3>
                      <p>Vehicles available at this rank and below.</p>
                      <ArrowRight size={21} />
                    </button>
                  ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="stage-title">
              <h2>{rank?.title ?? rankId} fleet.</h2>
              <p>
                Choose a vehicle to see its lighting, accessories, decals, and
                antennas.
              </p>
            </div>
            <div className="vehicle-list">
              {division === "REGULAR"
                ? cars.map((item) => (
                    <button
                      className="vehicle-list-item"
                      key={item.car.name}
                      onClick={(): void => selectCar(item.car.name)}
                    >
                      <span>
                        <strong>{item.car.name}</strong>
                        <small>
                          {item.car.cls} · Assigned at {item.section.title}
                          {item.car.showWarning
                            ? " · Certification required"
                            : ""}
                        </small>
                      </span>
                      <ArrowUpRight size={22} />
                    </button>
                  ))
                : subCars.map((name) => (
                    <button
                      className="vehicle-list-item"
                      key={name}
                      onClick={(): void => selectCar(name)}
                    >
                      <span>
                        <strong>{name}</strong>
                        <small>
                          Assigned at{" "}
                          {
                            guide?.ranks.find((r) => r.cars.includes(name))
                              ?.name
                          }
                        </small>
                      </span>
                      <ArrowUpRight size={22} />
                    </button>
                  ))}
            </div>
          </>
        )}
        {step === 4 && config && (
          <Configuration
            config={config}
            assigned={
              division === "REGULAR"
                ? (car?.section.title ?? "")
                : (guide?.ranks.find((r) => r.cars.includes(carName))?.name ??
                  rankId)
            }
            images={division === "REGULAR" ? images : undefined}
          />
        )}
      </div>
    </div>
  );
};
export default VehiclesPage;
