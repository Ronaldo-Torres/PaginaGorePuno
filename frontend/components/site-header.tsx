
import { FaThList } from "react-icons/fa";

export function SiteHeader() {
  return (
    <div className="flex items-center gap-2">
    <FaThList className="h-5 w-5" /> 
    <span className="text-sm font-medium leading-none">
      GOBIERNO REGIONAL DE PUNO
    </span>
  </div>
  );
}
