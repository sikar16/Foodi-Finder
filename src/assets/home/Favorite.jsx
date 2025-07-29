import { useState, useEffect } from "react";
import { MealCard } from "../home/component/MealCard";
import { mealApi } from "../../lib/meal-api";
import { Heart, Loader2, ChefHat, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "../../hooks/use-toast";
import { Header } from "./component/Header";
import { Link } from "react-router-dom";

export default function Favorite() {
    const [favoriteMeals, setFavoriteMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            setIsLoading(true);
            try {
                const favorites = JSON.parse(localStorage.getItem("foodie-favorites") || "[]");
                setFavoriteIds(favorites);

                if (favorites.length === 0) {
                    setIsLoading(false);
                    return;
                }

                const mealPromises = favorites.map((id) => mealApi.getMealById(id));
                const meals = await Promise.all(mealPromises);
                const validMeals = meals.filter((meal) => meal !== null);

                setFavoriteMeals(validMeals);
            } catch (error) {
                console.error("Error loading favorites:", error);
                toast({
                    title: "Error",
                    description: "Could not load your favorite meals. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const clearAllFavorites = () => {
        localStorage.removeItem("foodie-favorites");
        setFavoriteMeals([]);
        setFavoriteIds([]);
        toast({
            title: "Favorites cleared",
            description: "All favorite meals have been removed.",
        });
    };

    const removeFavorite = (mealId) => {
        const updatedFavorites = favoriteIds.filter((id) => id !== mealId);
        localStorage.setItem("foodie-favorites", JSON.stringify(updatedFavorites));
        setFavoriteIds(updatedFavorites);
        setFavoriteMeals((prev) => prev.filter((meal) => meal.idMeal !== mealId));

        toast({
            title: "Removed from favorites",
            description: "Meal removed from your favorites.",
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
                <Header />
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin mr-2 text-amber-600" />
                    <span className="text-lg text-amber-900">Loading your favorites...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <Heart className="h-16 w-16 text-red-500 fill-current" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-amber-900">
                        Your Favorite Meals
                    </h1>

                    {favoriteMeals.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <div className="flex items-center gap-2 text-amber-800">
                                <Heart className="h-5 w-5 text-red-500 fill-current" />
                                <span>
                                    {favoriteMeals.length} favorite
                                    {favoriteMeals.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAllFavorites}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>

                {favoriteMeals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoriteMeals.map((meal) => (
                            <div key={meal.idMeal} className="relative group">
                                <MealCard meal={meal} />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeFavorite(meal.idMeal)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card className="max-w-md mx-auto border-amber-200 bg-amber-100">
                        <CardContent className="text-center py-12">
                            <Heart className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-amber-900">No favorites yet</h3>
                            <p className="text-amber-800/80 mb-6">
                                Start exploring and save your favorite meals by clicking the heart icon on any recipe!
                            </p>
                            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
                                <Link to="/">Discover Meals</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}