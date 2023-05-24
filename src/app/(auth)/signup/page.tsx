import { AuthForm } from '~/widgets/authForm';
import { SignupForm } from '~/features/auth/signupForm';

export default function SignupPage() {
  return (
    <AuthForm>
      <SignupForm />
    </AuthForm>
  )
}