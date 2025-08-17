import { Loader2 } from "lucide-react";
import React  from "react";

const LoadingOverlay : React.FC = () => {
    return (
        /* make a spinner blue and center it */
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-100 bg-opacity-10 !important">
            <Loader2 className=" rounded-full h-30 w-30 animate-spin" />
        </div>
    );
};

export default LoadingOverlay;