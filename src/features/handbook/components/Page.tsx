import { useCallback, useMemo, useState } from "react";
import type { FC, ChangeEvent } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Search } from "lucide-react";
import PageHeading from "~components/PageHeading";
import { handbookApi } from "~features/handbook/api/handbookApi";
const rankTiers: Record<string, string> = {
  "Low Rank": "lr",
  "Master Trooper": "lr",
  "Veteran Trooper": "lr",
  "High Rank": "hr",
  "Former HR": "hr",
  "Senior High Rank": "shr",
  "Former SHR": "shr",
  "High Command": "hicom",
  "Former HICOM": "hicom",
};
const addRankPills = (html: string): string =>
  html.replace(
    /<span><span>(@FHP Ghost \| ([^<]+))<\/span><\/span>/g,
    (_match, label: string, rank: string) =>
      `<span class="rank-pill rank-pill--${rankTiers[rank] ?? "default"}">${label}</span>`,
  );
const HandbookPage: FC = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["handbook"],
    queryFn: handbookApi.get,
  });
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      data.filter((s) =>
        `${s.title} ${s.searchText}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data, query],
  );
  const search = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setQuery(event.target.value),
    [],
  );
  return (
    <div className="section-shell">
      <PageHeading
        title="Handbook"
        description="All core policies and procedures of the FHP Ghost Unit. Review every section before your first shift. This document is subject to change with notice."
      />
      <div className="handbook-layout">
        <aside className="toc">
          <label className="search-box">
            <Search size={17} />
            <input
              type="search"
              placeholder="Find a policy…"
              aria-label="Search handbook policies"
              value={query}
              onChange={search}
            />
          </label>
          <nav aria-label="Table of contents">
            {data.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                <span>{s.title.split(" ")[0]}</span>
                {s.title.slice(s.title.indexOf(" ") + 1)}
              </a>
            ))}
            <a href="#hspu-handbook">
              <span>02</span>HSPU reference
            </a>
            <a href="#srt-handbook">
              <span>03</span>SRT reference
            </a>
          </nav>
        </aside>
        <div className="policy-content">
          <p className="policy-count" role="status">
            {filtered.length} of {data.length} sections
          </p>
          {filtered.length === 0 && (
            <div className="empty-state">
              <h2>No matching policies.</h2>
              <p>
                Try a different search or clear the field to read the full
                handbook.
              </p>
            </div>
          )}
          {filtered.map((section) => (
            <article
              className="policy-section"
              id={section.id}
              key={section.id}
            >
              <h2>
                <span>{section.title.split(" ")[0]}</span>
                {section.title.slice(section.title.indexOf(" ") + 1)}
              </h2>
              <div
                className="policy-prose"
                dangerouslySetInnerHTML={{ __html: addRankPills(section.html) }}
              />
              <a href="#main" className="back-top">
                Back to top ↑
              </a>
            </article>
          ))}
          <article className="policy-section" id="hspu-handbook">
            <h2>High Speed Pursuit Unit</h2>
            <p>
              Access to high-performance vehicles and grappler, subject to
              division rank and vehicle availability. Applications require
              Trooper First Class rank or higher.
            </p>
            <div className="inline-links">
              <Link to="/vehicle-guidelines.html">
                Vehicle configurations <ArrowUpRight size={16} />
              </Link>
              <Link to="/hspu_app_new.html">
                HSPU application <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
          <article className="policy-section" id="srt-handbook">
            <h2>Special Response Team</h2>
            <p>
              Access to heavy duty and armored vehicles, and CQB training,
              subject to division rank and vehicle availability. Applications
              require Trooper First Class rank or higher.
            </p>
            <div className="inline-links">
              <Link to="/vehicle-guidelines.html">
                Vehicle configurations <ArrowUpRight size={16} />
              </Link>
              <Link to="/srt_app_new.html">
                SRT application <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
export default HandbookPage;
