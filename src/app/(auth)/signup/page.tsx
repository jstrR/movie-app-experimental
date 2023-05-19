import { SignupForm } from '~/features/auth/signupForm';

export default function SignupPage() {
  return (
    <div className="flex flex-col flex-nowrap items-center w-full sm:w-1/2 ">
      <div className="flex grow-[9] flex-col w-full items-center justify-center mt-8 sm:mt-0  ">
        <SignupForm />
      </div>
      <div className="flex grow-[1] flex-col justify-end">
        <h2 className="flex text-xl justify-end text-mainColor font-bold mb-4">
          Copyright © Movie-App {new Date().getFullYear()}
        </h2>
      </div>
    </div>
  )
}
