import { Job } from "@prisma/client";
import { Card } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { statusColorMap } from "@/constants/colors";

interface JobCardProps {
  job: Job;
  onDelete: (jobId: string) => void;
  isDeleting: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, isDeleting }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription className="line-clamp-3">{job.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>Budget: ${job.budget.toFixed(2)}</span>
            <Badge variant="outline" className={statusColorMap[job.status]}>
            {job.status}
          </Badge>
        </div>
        <p className="text-xs text-gray-400">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Skills:</span> {job.requiredSkills.join(', ')}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
        <Link href={`/jobs/${job.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/jobs/${job.id}/edit`}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your job
                and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(job.id)} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Continue'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
export default JobCard;