import { ProposalStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-yellow-200 text-yellow-800">
          <Clock className="w-3 h-3 mr-1 inline" /> Pending
        </Badge>
      );
    case "ACCEPTED":
      return (
        <Badge className="bg-green-200 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Accepted
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-red-200 text-red-800">
          <XCircle className="w-3 h-3 mr-1 inline" /> Rejected
        </Badge>
      );
    case "WITHDRAWN":
      return <Badge className="bg-gray-200 text-gray-800">Withdrawn</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
