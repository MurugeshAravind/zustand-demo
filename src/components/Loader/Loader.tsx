import { ClipLoader } from "react-spinners";

type LoaderType = {
  color: string;
  size: number;
};

const Loader = ({ color, size }: LoaderType) => {
  return (
    <div className="relative min-h-[200px]">
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <ClipLoader color={color} loading={true} size={size} />
      </div>
    </div>
  );
};

export default Loader;
