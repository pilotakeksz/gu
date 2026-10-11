import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GitBranch,
  CarFront,
  Users,
  Camera,
} from "lucide-react";
import { homeApi } from "~features/home/api/homeApi";
const resources = [
  {
    to: "/handbook.html",
    title: "Department handbook",
    description: "Rules & regulations, SOPs, quotas, and expectations.",
    Icon: BookOpen,
  },
  {
    to: "/chain-of-command.html",
    title: "Chain of command",
    description: "Department structure and permissions.",
    Icon: GitBranch,
  },
  {
    to: "/vehicle-guidelines.html",
    title: "Vehicle guidelines",
    description: "Approved fleet, accessories, decals and lighting.",
    Icon: CarFront,
  },
  {
    to: "/troopers.html",
    title: "Trooper roster",
    description: "Our personnel and unit call signs.",
    Icon: Users,
  },
  {
    to: "/official_media.html",
    title: "Official media",
    description: "Operations, events, and departmental moments.",
    Icon: Camera,
  },
] as const;
const HomePage: FC = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["home"],
    queryFn: homeApi.get,
  });
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <h1>
            GHOST
            <br />
            <span>UNIT.</span>
          </h1>
          <p>
            Florida Highway Patrol.
            <br />A division of FSRP.
          </p>
          <Link to="/handbook.html" className="button button-brass">
            Read the handbook <ArrowUpRight size={19} />
          </Link>
        </div>
        <figure className="hero-image">
          <img
            src="/assets/gallery/gallery-1769874621529.webp"
            alt="Ghost Unit patrol vehicles lined up during a nighttime operation"
            width="1600"
            height="900"
            fetchPriority="high"
          />
          <figcaption>
            <span>PHOTO / 40K_WOLF, IlIlIlIlIlllllIIIllI</span>
          </figcaption>
        </figure>
      </section>

      <section className="overview section-shell">
        <div>
          <h2>Who we are</h2>
        </div>
        <div className="overview-body">
          <p className="lead">{data[0]?.body}</p>
          <Link to="/troopers.html" className="text-link">
            Meet the troopers <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section
        className="resources section-shell"
        aria-labelledby="resources-title"
      >
        <div className="section-top">
          <div>
            <h2 id="resources-title">Division resources</h2>
          </div>
        </div>
        <div className="resources-layout">
          <div className="resource-list">
            {resources.map(({ to, title, description, Icon }, i) => (
              <Link to={to} key={to} className="resource-row">
                <span className="resource-number">0{i + 1}</span>
                <Icon className="resource-icon" size={22} strokeWidth={1.4} />
                <span className="resource-text">
                  <strong>{title}</strong>
                  <span>{description}</span>
                </span>
                <ArrowUpRight size={21} />
              </Link>
            ))}
          </div>
          <aside className="duty-note">
            <BookOpen size={28} strokeWidth={1} />
            <h3>Shift requirements</h3>
            <p>
              Review all core policies and procedures before your first shift.
            </p>
            <div className="quota">
              <strong>
                1.5<span>HRS</span>
              </strong>
              <p>
                Minimum weekly shift quota
                <br />
                Tuesday · 18:00 UTC
              </p>
            </div>
            <Link to="/handbook.html" hash="gu-5" className="text-link">
              Review duty requirements <ArrowRight size={18} />
            </Link>
          </aside>
        </div>
      </section>
      <section className="safety-statement section-shell">
        <div className="safety-layout">
          <h2>
            REDUCE SPEED.
            <br />
            <span>ARRIVE ALIVE.</span>
          </h2>
          <p>{data[1]?.body}</p>
        </div>
      </section>
      <section className="subdivisions section-shell">
        <div className="section-top">
          <div>
            <h2>Our subdivisions</h2>
          </div>
          <p>{data[2]?.body}</p>
        </div>
        <div className="division-grid">
          <article className="division-card">
            <div className="division-name">
              <h3>HSPU</h3>
              <ArrowUpRight size={36} strokeWidth={1} />
            </div>
            <p>
              High Speed Pursuit Unit. Access to high-performance vehicles* and
              a grappler.
            </p>
            <span className="eligibility">TROOPER FIRST CLASS OR HIGHER</span>
            <div className="division-links">
              <Link to="/hspu_app_new.html" className="text-link">
                Apply to HSPU <ArrowRight size={18} />
              </Link>
              <Link to="/handbook.html" hash="hspu-handbook">
                Unit reference ↗
              </Link>
            </div>
          </article>
          <article className="division-card">
            <div className="division-name">
              <h3>SRT</h3>
              <ArrowUpRight size={36} strokeWidth={1} />
            </div>
            <p>
              Special Response Team. Access to heavy duty and armored vehicles*,
              and CQB training.
            </p>
            <span className="eligibility">TROOPER FIRST CLASS OR HIGHER</span>
            <div className="division-links">
              <Link to="/srt_app_new.html" className="text-link">
                Apply to SRT <ArrowRight size={18} />
              </Link>
              <Link to="/handbook.html" hash="srt-handbook">
                Unit reference ↗
              </Link>
            </div>
          </article>
        </div>
        <p className="fine-print">
          *Subject to division rank and vehicle availability.
        </p>
      </section>
    </>
  );
};
export default HomePage;
