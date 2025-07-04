import { Proposal, Job } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProposalStatusBadge } from "./ProposalStatusBadge";

interface Props {
  proposal: Proposal & { job: Job };
}

export function ProposalCard({ proposal }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {proposal.job.title}
          <ProposalStatusBadge status={proposal.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{proposal.coverLetter}</p>
        <div className="mt-4 flex justify-between text-sm">
          <p>💰 Proposed: ₹{proposal.proposedPrice}</p>
          <p>🛠 Skills: {proposal.job.requiredSkills.join(", ")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
