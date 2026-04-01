import { FiLoader } from "react-icons/fi";

const Loader = () => {
    return (
        <div className="w-full flex items-center justify-center">
            <FiLoader className="animate-spin mb-4" size={48} />
            <p className="animate-pulse tracking-widest">LOADING MERCHANT DATA...</p>
        </div >
    );
}

export default Loader;