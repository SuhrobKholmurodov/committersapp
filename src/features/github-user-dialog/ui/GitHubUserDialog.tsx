import { ArrowUpRight } from "lucide-react";
import { avatarSrcSet, avatarUrl } from "@/entities/committer";
import { useGetGitHubUserQuery } from "@/entities/github-user";
import { formatNumber } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ErrorMessage } from "@/shared/ui/ErrorMessage";
import { LoadingSpinner } from "@/shared/ui/LoadingSpinner";

interface GitHubUserDialogProps {
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GitHubUserDialog = ({
  username,
  open,
  onOpenChange,
}: GitHubUserDialogProps) => {
  const { data: user, error, isLoading } = useGetGitHubUserQuery(username, {
    skip: !open,
  });

  const stats = user
    ? [
        { label: "Followers", value: user.followers },
        { label: "Following", value: user.following },
        { label: "Repositories", value: user.public_repos },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-[360px] bg-white dark:bg-gray-900 rounded-md">
        <DialogHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold">
            User info: {username}
          </DialogTitle>
          <DialogDescription className="sr-only">
            GitHub profile details for {username}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 min-h-[200px]">
          {isLoading && <LoadingSpinner />}
          {!isLoading && error && (
            <ErrorMessage
              title="Error loading data"
              message="Try refreshing the page."
              className="mt-10"
            />
          )}

          {user && (
            <div className="space-y-4">
              <div className="flex items-center space-x-5">
                <img
                  src={avatarUrl(user.avatar_url, 80)}
                  srcSet={avatarSrcSet(user.avatar_url, 80)}
                  alt={`${user.login} avatar`}
                  width={80}
                  height={80}
                  className="w-20 h-20 border border-gray-300 rounded-full dark:border-gray-600"
                />
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                    {user.name || user.login}
                  </h3>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View GitHub Profile <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {user.bio && (
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {user.bio}
                </p>
              )}

              <dl className="grid grid-cols-3 gap-6 text-sm text-center">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt className="text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </dt>
                    <dd className="block text-2xl font-semibold text-gray-900 dark:text-white">
                      {formatNumber(stat.value)}
                    </dd>
                  </div>
                ))}
              </dl>

              {user.location && (
                <p className="italic text-center text-gray-600 dark:text-gray-400">
                  Location: {user.location}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="grid w-full pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
