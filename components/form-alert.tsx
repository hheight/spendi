import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FormAlert({ text }: { text: string | null }) {
  if (!text) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
}
