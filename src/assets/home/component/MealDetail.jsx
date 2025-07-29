import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mealApi } from "../../../lib/meal-api";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
    ArrowLeft,
    Clock,
    MapPin,
    Tag,
    Youtube,
    ChefHat,
    Loader2,
    Heart,
    Share2,
    Utensils,
} from "lucide-react";
import { toast } from "../../../hooks/use-toast";
import { Header } from "./Header";

export default function MealDetail() {
    const { id: mealId } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchMeal = async () => {
            if (!mealId) return;

            setIsLoading(true);
            try {
                const mealData = await mealApi.getMealById(mealId);
                setMeal(mealData);

                const favorites = JSON.parse(localStorage.getItem("foodie-favorites") || "[]");
                setIsFavorite(favorites.includes(mealId));
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Could not load meal details. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeal();
    }, [mealId]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem("foodie-favorites") || "[]");
        let newFavorites;

        if (isFavorite) {
            newFavorites = favorites.filter((id) => id !== mealId);
            toast({
                title: "Removed from favorites",
                description: "Meal removed from your favorites.",
            });
        } else {
            newFavorites = [...favorites, mealId];
            toast({
                title: "Added to favorites",
                description: "Meal added to your favorites!",
            });
        }

        localStorage.setItem("foodie-favorites", JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
    };

    const shareRecipe = async () => {
        if (navigator.share && meal) {
            try {
                await navigator.share({
                    title: meal.strMeal,
                    text: `Check out this delicious ${meal.strMeal} recipe!`,
                    url: window.location.href,
                });
            } catch (error) {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link copied!", description: "Recipe link copied to clipboard." });
            }
        } else if (meal) {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link copied!", description: "Recipe link copied to clipboard." });
        }
    };

    const getIngredients = (meal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    ingredient: ingredient.trim(),
                    measure: measure?.trim() || "",
                });
            }
        }
        return ingredients;
    };

    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
                <Header />
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin mr-2 text-amber-600" />
                    <span className="text-lg text-amber-900">Loading recipe...</span>
                </div>
            </div>
        );
    }

    if (!meal) {
        return (
            <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
                <Header />
                <div className="text-center py-12">
                    <ChefHat className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2 text-amber-900">Recipe not found</h2>
                    <p className="text-amber-800/80 mb-4">
                        The recipe you're looking for doesn't exist or has been removed.
                    </p>
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    const ingredients = getIngredients(meal);
    const youtubeVideoId = meal.strYoutube ? getYouTubeVideoId(meal.strYoutube) : null;

    return (
        <div className="bg-amber-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 text-amber-800 hover:bg-amber-100"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Image */}
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-amber-200">
                        <img
                            src={meal.strMealThumb || "/placeholder.svg"}
                            alt={meal.strMeal}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Meal Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-amber-900">{meal.strMeal}</h1>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {meal.strCategory && (
                                    <Badge variant="secondary" className="text-sm bg-amber-100 text-amber-800 hover:bg-amber-200">
                                        <Tag className="w-4 h-4 mr-1 text-amber-600" />
                                        {meal.strCategory}
                                    </Badge>
                                )}
                                {meal.strArea && (
                                    <Badge variant="outline" className="text-sm border-amber-300 text-amber-800 hover:bg-amber-50">
                                        <MapPin className="w-4 h-4 mr-1 text-amber-600" />
                                        {meal.strArea}
                                    </Badge>
                                )}
                                {meal.strTags &&
                                    meal.strTags.split(",").map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-sm border-amber-300 text-amber-800 hover:bg-amber-50"
                                        >
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                            </div>

                            <div className="flex gap-2 mb-6">
                                <Button
                                    onClick={toggleFavorite}
                                    variant="outline"
                                    size="sm"
                                    className="border-amber-300 text-amber-800 hover:bg-amber-100"
                                >
                                    <Heart
                                        className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current text-red-500" : "text-amber-600"}`}
                                    />
                                    {isFavorite ? "Favorited" : "Add to Favorites"}
                                </Button>
                                <Button
                                    onClick={shareRecipe}
                                    variant="outline"
                                    size="sm"
                                    className="border-amber-300 text-amber-800 hover:bg-amber-100"
                                >
                                    <Share2 className="h-4 w-4 mr-2 text-amber-600" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <Card className="bg-amber-100 border-amber-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-900">
                                    <ChefHat className="h-5 w-5 text-amber-700" />
                                    Ingredients ({ingredients.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    <ul className="space-y-2">
                                        {ingredients.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between items-center py-2 border-b border-amber-200 last:border-b-0"
                                            >
                                                <span className="font-medium text-amber-900">{item.ingredient}</span>
                                                <span className="text-amber-800/80">{item.measure}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="w-full mb-8">
                    {youtubeVideoId && (
                        <Card className="border-amber-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-900">
                                    <Youtube className="h-5 w-5 text-red-500" />
                                    Cooking Video
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                                        title="Cooking video"
                                        className="w-full h-full rounded-lg"
                                        allowFullScreen
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Instructions */}
                <Card className="border-amber-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-900">
                            <Clock className="h-5 w-5 text-amber-700" />
                            Cooking Instructions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none text-amber-900">
                            {meal.strInstructions.split("\n").map(
                                (paragraph, index) =>
                                    paragraph.trim() && (
                                        <p key={index} className="mb-4 leading-relaxed">
                                            {paragraph.trim()}
                                        </p>
                                    )
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}