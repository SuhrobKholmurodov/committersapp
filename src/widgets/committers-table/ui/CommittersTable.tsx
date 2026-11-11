import type { Committer } from "@/entities/committer";
import { formatNumber } from "@/shared/lib/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

interface CommittersTableProps {
  users: Committer[];
  countryName: string;
  onUserSelect: (user: Committer) => void;
}

export const CommittersTable = ({
  users,
  countryName,
  onUserSelect,
}: CommittersTableProps) => (
  <div className="relative overflow-x-auto">
    <Table className="w-full rounded-lg">
      <TableCaption className="sr-only">
        Most active GitHub users in {countryName}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            scope="col"
            className="sticky left-0 text-center dark:bg-gray-900/20 bg-gray-50/20 backdrop-blur-lg"
          >
            Rank
          </TableHead>
          <TableHead scope="col" className="min-w-[200px]">
            User
          </TableHead>
          <TableHead scope="col" className="text-center min-w-[100px]">
            Commits
          </TableHead>
          <TableHead scope="col" className="text-center min-w-[100px]">
            Avatar
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.username}
            className="duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <TableCell className="sticky left-0 font-medium text-center backdrop-blur-lg">
              {user.rank}
            </TableCell>

            <TableCell className="flex flex-col items-start gap-2">
              <button
                type="button"
                className="flex gap-2 text-blue-500 bg-transparent border-none cursor-pointer"
                onClick={() => onUserSelect(user)}
              >
                {user.username}
              </button>
              {user.realname && (
                <span className="text-sm text-gray-500">({user.realname})</span>
              )}
            </TableCell>

            <TableCell className="text-center">{formatNumber(user.commits)}</TableCell>

            <TableCell className="text-center">
              <img
                src={user.avatar}
                alt={`${user.username} GitHub avatar`}
                width={40}
                height={40}
                className="w-10 h-10 mx-auto border-2 border-gray-200 rounded-full dark:border-gray-600"
                loading="lazy"
                decoding="async"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
