import { useCallback, useMemo, useState } from "react";
import type { FC, ChangeEvent } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import PageHeading from "~components/PageHeading";
import { rosterApi } from "~features/roster/api/rosterApi";
import { useDebouncedValue } from "~features/roster/helpers/useDebouncedValue";
const RosterPage: FC = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["roster"],
    queryFn: rosterApi.get,
  });
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All personnel");
  const [division, setDivision] = useState("All divisions");
  const query = useDebouncedValue(search);
  const groups = useMemo(() => [...new Set(data.map((t) => t.group))], [data]);
  const filtered = useMemo(
    () =>
      data.filter(
        (t) =>
          (group === "All personnel" || group === t.group) &&
          (division === "All divisions" || t.specialties.includes(division)) &&
          `${t.name} ${t.rank} ${t.callsign} ${t.specialties}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [data, group, division, query],
  );
  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setSearch(event.target.value),
    [],
  );
  const handleGroup = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void =>
      setGroup(event.target.value),
    [],
  );
  const handleDivision = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void =>
      setDivision(event.target.value),
    [],
  );
  return (
    <div className="section-shell">
      <PageHeading
        title="Trooper roster"
        description="The people behind the standard. Our active roster, command appointments, unit call signs, and subdivision assignments."
      >
        <span className="roster-total">
          <strong>{data.length}</strong> PERSONNEL ON ROSTER
        </span>
      </PageHeading>
      <div className="roster-toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Name, rank, or call sign…"
            aria-label="Search trooper roster"
            value={search}
            onChange={handleSearch}
          />
        </label>
        <label className="select-label">
          RANK SECTION
          <select
            aria-label="Filter by rank section"
            value={group}
            onChange={handleGroup}
          >
            <option>All personnel</option>
            {groups.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="select-label">
          SUBDIVISION
          <select
            aria-label="Filter by subdivision"
            value={division}
            onChange={handleDivision}
          >
            <option>All divisions</option>
            <option>HSPU</option>
            <option>SRT</option>
            <option>JSOC</option>
          </select>
        </label>
        <span className="results-count" role="status">
          {filtered.length} results
        </span>
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <h2>No matching troopers.</h2>
          <p>Try another name, call sign, or filter.</p>
        </div>
      )}
      {groups
        .filter((g) => filtered.some((t) => t.group === g))
        .map((g) => (
          <section className="roster-section" key={g}>
            <div className="roster-group-title">
              <h2>{g}</h2>
            </div>
            <div className="trooper-grid">
              {filtered
                .filter((t) => t.group === g)
                .map((t) => (
                  <article className="trooper-card" key={t.callsign + t.name}>
                    <span className="callsign">{t.callsign}</span>
                    <div className="trooper-identity">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={`${t.name}'s avatar`}
                          width="72"
                          height="72"
                          loading="lazy"
                        />
                      ) : (
                        <span
                          className="avatar-initials"
                          aria-label={`${t.name}, avatar unavailable`}
                        >
                          {t.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <h3>{t.name}</h3>
                        <p>{t.rank}</p>
                      </div>
                    </div>
                    <div className="trooper-assignment">
                      <div className="specialty-pills">
                        {t.specialties ? (
                          t.specialties.split(/\s*•\s*/).map((specialty) => (
                            <span
                              className={`specialty-pill specialty-pill--${specialty.toLowerCase()}`}
                              key={specialty}
                            >
                              {specialty}
                            </span>
                          ))
                        ) : (
                          <span className="muted">GHOST UNIT</span>
                        )}
                      </div>
                      <span>FHP / FSRP</span>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      <div className="roster-end">
        <p>Leadership flow and permissions for every rank.</p>
        <Link to="/chain-of-command.html" className="text-link">
          Chain of command <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
};
export default RosterPage;
