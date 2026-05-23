import { Link } from "react-router-dom";

type AuthLinkProps = {
  text: string;
  to: string;
  linkText: string;
};

const AuthLink = ({ text, to, linkText }: AuthLinkProps) => {
  return (
    <p className="text-sm text-center text-gray-200 mt-4">
      {text}{" "}
      <Link
        to={to}
        className="text-cyan-300 font-medium hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default AuthLink;