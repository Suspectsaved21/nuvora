
import { Button } from "@/components/ui/button";
import { GAME_CATEGORIES } from "@/data/gameData";

interface CategorySelectorProps {
  category: string;
  setCategory: (category: string) => void;
}

const CategorySelector = ({ category, setCategory }: CategorySelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Select Category</label>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={category === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategory("all")}
          className={category === "all" ? "bg-purple" : ""}
        >
          All
        </Button>
        
        {GAME_CATEGORIES.map(cat => (
          <Button
            key={cat.id}
            variant={category === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(cat.id)}
            className={category === cat.id ? "bg-purple" : ""}
          >
            {cat.icon} {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
