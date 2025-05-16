import { AlertTriangle } from 'lucide-react';

import { Card, CardContent } from './Card';

export function NotFound({
  message = 'Data tidak ditemukan',
  subtitle = 'Coba periksa filter atau kata kunci pencarian Anda.',
}: {
  message?: string;
  subtitle?: string;
}) {
  return (
    <Card className="flex items-center justify-center py-16 bg-muted/40 border-0 shadow-none">
      <CardContent className="flex flex-col items-center gap-4">
        <AlertTriangle size={48} className="text-yellow-500" />
        <div className="text-xl font-semibold text-muted-foreground">{message}</div>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
}
