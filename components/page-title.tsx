export default function PageTitle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <h1 className="text-xl font-medium">{text}</h1>
    </div>
  );
}
