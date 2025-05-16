import { Card, CardContent } from './Card';
import { Skeleton } from './Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <Card className="p-0 overflow-x-auto">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-sidebar-primary">
            <TableRow>
              {[...Array(columns)].map((_, colIdx) => (
                <TableHead key={colIdx}>
                  <Skeleton className="h-4 w-24 bg-muted" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(rows)].map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {[...Array(columns)].map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-6 w-full bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
