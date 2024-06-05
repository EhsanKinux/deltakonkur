import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex gap-2 justify-center items-centerّ">
      <div className="flex flex-col">
        <div>SignUp Page</div>
        <Link to="/auth/signIn">
          <Button className="mb-2 px-4 py-2 bg-lime-400 rounded">Go to sign In</Button>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
