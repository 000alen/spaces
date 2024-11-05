import { Space } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface LocationLayoutProps {
  spaces: Space[];
  selectedSpace: string | null;
  setSelectedSpace: (spaceId: string) => void;
}

export const LocationLayout: React.FC<LocationLayoutProps> = ({
  spaces,
  selectedSpace,
  setSelectedSpace,
}) => {
  return (
    <div className="relative w-full h-64 bg-white rounded-lg shadow-md">
      <TooltipProvider>
        {spaces.map((space) => (
          <Tooltip key={space.id}>
            <TooltipTrigger>
              <div
                className={`absolute rounded-md border-2 ${
                  selectedSpace === space.id
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 bg-gray-50"
                } cursor-pointer transition-all hover:bg-gray-100`}
                style={{
                  left: `${space.x}%`,
                  top: `${space.y}%`,
                  width: space.width ? `${space.width}%` : "10%",
                  height: space.height ? `${space.height}%` : "10%",
                }}
                onClick={() => setSelectedSpace(space.id)}
              >
                <span className="text-xs font-medium">{space.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{space.name}</p>
              <p>{space.type}</p>
              <p>Capacity: {space.capacity}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
