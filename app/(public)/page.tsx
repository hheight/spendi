import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="mb-3 text-4xl font-bold">Welcome to Spendi</h1>
      <div className="text-accent-foreground mb-8 max-w-md">
        <p>Welcome to the Spendi Expense Tracker application.</p>
        <p>
          Please{" "}
          <Link className="underline" href="/login">
            login
          </Link>{" "}
          or{" "}
          <Link className="underline" href="/signup">
            create a user
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
