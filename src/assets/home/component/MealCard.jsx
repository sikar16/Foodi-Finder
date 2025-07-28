import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export function MealCard({ meal }) {
    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={meal.strMealThumb || "/placeholder.svg"}
                    alt={meal.strMeal}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {meal.strMeal}
                </h3>

                <div className="flex flex-wrap gap-2 mb-3">
                    {meal.strCategory && (
                        <Badge variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {meal.strCategory}
                        </Badge>
                    )}
                    {meal.strArea && (
                        <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {meal.strArea}
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                    <Link to={`/meal/${meal.idMeal}`}>View Recipe</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
