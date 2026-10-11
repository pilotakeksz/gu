import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import PageHeading from "~components/PageHeading";
interface ApplicationProps {
  division: "HSPU" | "SRT";
}
const forms = {
  HSPU: "https://docs.google.com/forms/d/e/1FAIpQLSf3v4SEWEihgzKJa8JTst9omh88dz8aJdzr0JPL7CW5wxyHdA/viewform",
  SRT: "https://docs.google.com/forms/d/e/1FAIpQLSfbLNTEf6pc23ikSdVv5GLEkIkU4eFAXGNL4awbWXTKHi-CyA/viewform",
};
const ApplicationPage: FC<ApplicationProps> = ({ division }) => (
  <div className="section-shell application-page">
    <PageHeading
      title={`${division} application`}
      description={
        division === "HSPU"
          ? "High Speed Pursuit Unit. Specialized high-speed pursuit operations with access to high-performance vehicles and grappler."
          : "Special Response Team. Tactical response operations with access to heavy duty and armored vehicles, and CQB training."
      }
    />
    <div className="application-layout">
      <aside>
        <h2>Application requirements</h2>
        <div className="application-requirement">
          <span>MINIMUM RANK</span>
          <strong>Trooper First Class</strong>
          <p>
            {division === "HSPU"
              ? "Trooper First Class+. You must work well with others and have exceptional pursuit skills."
              : "Trooper First Class+. You must collaborate with others and strictly follow procedures."}
          </p>
        </div>
        <p className="fine-print">
          Vehicle access is subject to division rank and vehicle availability.
        </p>
        <Link to="/handbook.html" className="text-link">
          Review the handbook <ArrowUpRight size={17} />
        </Link>
        <Link to="/index.html" className="text-link">
          <ArrowLeft size={17} />
          Back to the unit
        </Link>
      </aside>
      <div className="form-panel">
        <div className="form-panel-header">
          <a href={forms[division]} target="_blank" rel="noreferrer">
            Open in a new tab <ArrowUpRight size={16} />
          </a>
        </div>
        <iframe
          title={`${division} application form`}
          src={`${forms[division]}?embedded=true&hl=en`}
          loading="lazy"
          height={division === "HSPU" ? 1418 : 886}
        />
        <p className="form-fallback">
          If the form does not load,{" "}
          <a href={forms[division]} target="_blank" rel="noreferrer">
            open the original application form ↗
          </a>
          .
        </p>
      </div>
    </div>
  </div>
);
export default ApplicationPage;
