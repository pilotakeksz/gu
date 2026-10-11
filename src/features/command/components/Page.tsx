import type { FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import PageHeading from "~components/PageHeading";
import { commandApi } from "~features/command/api/commandApi";
const CommandPage: FC = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["command"],
    queryFn: commandApi.get,
  });
  return (
    <div className="section-shell">
      <PageHeading
        title="Chain of command"
        description="Use the chain of command for approvals, guidance, and escalation. Maintain respect at every level and keep command staff informed on major incidents."
      >
        <Link to="/troopers.html" className="text-link">
          View the active roster <ArrowUpRight size={17} />
        </Link>
      </PageHeading>

      <div className="command-flow">
        {data.map((tier, i) => (
          <section className="command-tier" key={tier.title}>
            <div className="command-label">
              <span className="command-number">0{i + 1}</span>

              <h2>{tier.title}</h2>
            </div>
            <div className="command-ranks">
              {tier.ranks.map((rank) => (
                <div className="command-rank" key={rank.name}>
                  <span>{rank.name}</span>
                  {rank.permission && (
                    <span className="permission">{rank.permission}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
export default CommandPage;
