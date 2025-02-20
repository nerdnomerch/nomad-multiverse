import { ArrowIcon } from "./icons/ArrowIcon";

interface LoginButtonProps {
  onClick: () => void;
}

export function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full bg-blue-600 text-white py-3 px-6 rounded-md
        hover:bg-blue-700 transition-colors duration-200
        flex items-center justify-center space-x-2
      `}
    >
      <span>Continue with sign in</span>
      <ArrowIcon />
    </button>
  );
}
