
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationButtonsProps {
  findNewPartner: () => void;
  isFindingPartner: boolean;
}

const NavigationButtons = ({ findNewPartner, isFindingPartner }: NavigationButtonsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-center z-40">
      <Button 
        variant="default" 
        size={isMobile ? "default" : "lg"}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 shadow-lg"
        onClick={findNewPartner}
        disabled={isFindingPartner}
      >
        <span className="mr-2">Next</span>
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

export default NavigationButtons;
