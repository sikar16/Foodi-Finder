import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { mealApi } from "../../../lib/meal-api";
import { Loader2 } from "lucide-react";

export function CategoryFilter({ selectedCategory, onCategoryChange }) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await mealApi.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2 p-1">
                    <Button
                        variant={selectedCategory === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => onCategoryChange(null)}
                        className="shrink-0"
                    >
                        All Categories
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.idCategory}
                            variant={selectedCategory === category.strCategory ? "default" : "outline"}
                            size="sm"
                            onClick={() => onCategoryChange(category.strCategory)}
                            className="shrink-0"
                        >
                            {category.strCategory}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
