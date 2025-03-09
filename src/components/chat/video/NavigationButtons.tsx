
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  findNewPartner: () => void;
}

const NavigationButtons = ({ findNewPartner }: NavigationButtonsProps) => {
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40 rounded-full h-10 w-10"
        onClick={findNewPartner}
      >
        <ChevronLeft size={20} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40 rounded-full h-10 w-10"
        onClick={findNewPartner}
      >
        <ChevronRight size={20} />
      </Button>
    </>
  );
};

export default NavigationButtons;
