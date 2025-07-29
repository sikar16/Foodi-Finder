import { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { MealCard } from "./MealCard";
import { CategoryFilter } from "./CategoryFilter";
import { mealApi } from "../../../lib/meal-api";
import { Loader2, ChefHat, Search, Utensils, Globe, TrendingUp, Star, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { toast } from "../../../hooks/use-toast";
import { useSearchParams } from "react-router-dom";

export default function Landingpage() {
    const [searchParams] = useSearchParams();
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [featuredMeals, setFeaturedMeals] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const category = searchParams.get("category");
        const area = searchParams.get("area");

        if (category) {
            handleCategoryChange(category);
        } else if (area) {
            handleAreaFilter(area);
        }
    }, [searchParams]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoriesData] = await Promise.all([mealApi.getCategories()]);
                setCategories(categoriesData.slice(0, 8));

                const featuredPromises = Array.from({ length: 4 }, () => mealApi.getRandomMeal());
                const featured = await Promise.all(featuredPromises);
                setFeaturedMeals(featured.filter((meal) => meal !== null));
            } catch (error) {
                console.error("Error loading initial data:", error);
            }
        };

        loadInitialData();
    }, []);

    const handleSearch = async (query, type) => {
        setIsLoading(true);
        setSearchQuery(query);
        setSelectedCategory(null);
        setHasSearched(true);

        try {
            let results = [];
            if (type === "name") {
                results = await mealApi.searchByName(query);
            } else {
                results = await mealApi.searchByIngredient(query);
            }

            setMeals(results);

            if (results.length === 0) {
                toast({
                    title: "No results found",
                    description: `No meals found for "${query}". Try a different search term.`,
                });
            }
        } catch (error) {
            console.error("Search failed:", error);
            toast({
                title: "Search failed",
                description: "Something went wrong while searching. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = async (category) => {
        if (category === selectedCategory) return;

        setSelectedCategory(category);
        setSearchQuery("");
        setHasSearched(true);

        if (category === null) {
            setMeals([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        try {
            const results = await mealApi.filterByCategory(category);
            setMeals(results);
        } catch (error) {
            console.error("Category filter failed:", error);
            toast({
                title: "Filter failed",
                description: "Something went wrong while filtering. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAreaFilter = async (area) => {
        setSelectedCategory(null);
        setSearchQuery("");
        setHasSearched(true);
        setIsLoading(true);

        try {
            const results = await mealApi.filterByArea(area);
            setMeals(results);
        } catch (error) {
            console.error("Area filter failed:", error);
            toast({
                title: "Filter failed",
                description: "Something went wrong while filtering. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRandomMeal = async () => {
        setIsLoading(true);
        try {
            const randomMeal = await mealApi.getRandomMeal();
            if (randomMeal) {
                setMeals([randomMeal]);
                setSelectedCategory(null);
                setSearchQuery("");
                setHasSearched(true);
            }
        } catch (error) {
            console.error("Random meal fetch failed:", error);
            toast({
                title: "Error",
                description: "Could not fetch a random meal. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const quickSearches = [
        { label: "Chicken", type: "ingredient" },
        { label: "Pasta", type: "name" },
        { label: "Beef", type: "ingredient" },
        { label: "Dessert", type: "name" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-300 rounded-full blur-xl"></div>
                            <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/codechef.png" alt="codechef" className="h-20 w-20 relative z-10" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-amber-900">
                        Foodie Finder
                    </h1>
                    <p className="text-sm md:text-lg text-amber-800/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Discover delicious meals from around the world. Search by ingredient, browse categories, or find your next favorite dish from our collection of thousands of recipes!
                    </p>

                    <div className="mb-8">
                        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    </div>

                    {!hasSearched && (
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            <span className="text-sm text-amber-800/80 mr-2">Quick searches:</span>
                            {quickSearches.map((search) => (
                                <Badge
                                    key={search.label}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-amber-600 hover:text-white transition-colors bg-amber-100 text-amber-800"
                                    onClick={() => handleSearch(search.label, search.type)}
                                >
                                    {search.label}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {!hasSearched && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                            <Card className="bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300">
                                <CardContent className="p-6 text-center">
                                    <Search className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">1000+ Recipes</h3>
                                    <p className="text-sm text-amber-800/80">From around the world</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
                                <CardContent className="p-6 text-center">
                                    <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">25+ Countries</h3>
                                    <p className="text-sm text-orange-800/80">International cuisine</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-red-100 to-red-200 border-red-300">
                                <CardContent className="p-6 text-center">
                                    <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">Step-by-step</h3>
                                    <p className="text-sm text-red-800/80">Detailed instructions</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {!hasSearched && (
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <Button
                                onClick={handleRandomMeal}
                                size="lg"
                                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                <Utensils className="h-5 w-5" />
                                Surprise Me!
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                                className="flex items-center gap-2 bg-transparent border-amber-600 text-amber-600 hover:bg-amber-50"
                            >
                                <a href="/favorites">
                                    <Star className="h-5 w-5" />
                                    My Favorites
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {!hasSearched && featuredMeals.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-8">
                            <TrendingUp className="h-6 w-6 text-amber-600" />
                            <h2 className="text-3xl font-bold text-amber-900">Featured Today</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredMeals.map((meal) => (
                                <MealCard key={meal.idMeal} meal={meal} />
                            ))}
                        </div>
                    </div>
                )}
                {!hasSearched && categories.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-8">
                            <Star className="h-6 w-6 text-amber-600" />
                            <h2 className="text-3xl font-bold text-amber-900">Popular Categories</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map((category) => (
                                <Card
                                    key={category.idCategory}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group bg-amber-50 border-amber-200 hover:border-amber-400"
                                    onClick={() => handleCategoryChange(category.strCategory)}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center group-hover:from-amber-300 group-hover:to-amber-400 transition-colors">
                                            <ChefHat className="h-8 w-8 text-amber-700" />
                                        </div>
                                        <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                                            {category.strCategory}
                                        </h3>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Search className="h-6 w-6 text-amber-600" />
                        <h2 className="text-3xl font-bold text-amber-900">Browse by Category</h2>
                    </div>
                    <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-600" />
                            <span className="text-xl font-medium text-amber-900">Finding delicious meals...</span>
                            <p className="text-amber-800/80 mt-2">This won't take long!</p>
                        </div>
                    </div>
                )}

                {!isLoading && hasSearched && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-6 text-amber-900">
                            {searchQuery && `Search results for "${searchQuery}"`}
                            {selectedCategory && `${selectedCategory} Meals`}
                            {!searchQuery && !selectedCategory && "Random Meal Discovery"}
                            {meals.length > 0 && ` (${meals.length} found)`}
                        </h2>

                        {meals.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {meals.map((meal) => (
                                    <MealCard key={meal.idMeal} meal={meal} />
                                ))}
                            </div>
                        ) : (
                            <Card className="max-w-md mx-auto bg-amber-50 border-amber-200">
                                <CardContent className="text-center py-12">
                                    <ChefHat className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2 text-amber-900">No meals found</h3>
                                    <p className="text-amber-800/80 mb-4">
                                        Try searching with different keywords or browse our categories.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setHasSearched(false);
                                            setMeals([]);
                                            setSelectedCategory(null);
                                            setSearchQuery("");
                                        }}
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        Start Over
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}