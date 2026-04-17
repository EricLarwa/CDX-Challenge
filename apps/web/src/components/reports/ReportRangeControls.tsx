import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ReportRangeControlsProps = {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
};

export function ReportRangeControls(props: ReportRangeControlsProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="grid gap-4 p-5 md:grid-cols-2">
        <Label>
          <span>From</span>
          <Input type="date" value={props.from} onChange={(event) => props.onFromChange(event.target.value)} />
        </Label>
        <Label>
          <span>To</span>
          <Input type="date" value={props.to} onChange={(event) => props.onToChange(event.target.value)} />
        </Label>
      </CardContent>
    </Card>
  );
}
