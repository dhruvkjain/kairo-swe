export default function VerifyEmail() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold mb-2">Verify your email</h1>
      <p className="text-muted-foreground">
        We have sent a verification link to your email address. 
        Please check your inbox and click the link to activate your account.
      </p>
    </div>
  );
}
