import { AuthForm } from "~/widgets/authForm";
import { LoginForm } from "~/features/auth/loginForm";

export default function LoginPage() {
  return (
    <AuthForm>
      <LoginForm />
    </AuthForm>
  );
}
