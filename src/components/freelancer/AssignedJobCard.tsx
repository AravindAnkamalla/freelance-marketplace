import { Job } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  job: Job;
}

export function AssignedJobCard({ job }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {job.title}
          <Badge variant="outline" className="capitalize text-xs">
            {job.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{job.description}</p>
        <div className="flex justify-between mt-4 text-sm">
          <p>💰 Budget: ₹{job.budget}</p>
          {job.deadline && (
            <p>⏰ {new Date(job.deadline).toLocaleDateString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
