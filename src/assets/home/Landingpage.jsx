import { useState, useEffect } from "react";
import { SearchBar } from "../home/component/SearchBar";
import { MealCard } from "../home/component/MealCard";
import { CategoryFilter } from "../home/component/CategoryFilter";
import { mealApi } from "../../lib/meal-api";
import { Loader2, ChefHat, Search, Utensils, Globe, TrendingUp, Star, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../hooks/use-toast";
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
                            <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/codechef.png" alt="codechef" className="h-20 w-20 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 ">
                        Foodie Finder
                    </h1>
                    <p className="text-sm md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                        Discover delicious meals from around the world. Search by ingredient, browse categories, or find your next favorite dish from our collection of thousands of recipes!
                    </p>

                    <div className="mb-8">
                        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    </div>

                    {!hasSearched && (
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            <span className="text-sm text-muted-foreground mr-2">Quick searches:</span>
                            {quickSearches.map((search) => (
                                <Badge
                                    key={search.label}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={() => handleSearch(search.label, search.type)}
                                >
                                    {search.label}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {!hasSearched && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                                <CardContent className="p-6 text-center">
                                    <Search className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">1000+ Recipes</h3>
                                    <p className="text-sm text-muted-foreground">From around the world</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                                <CardContent className="p-6 text-center">
                                    <Globe className="h-8 w-8 text-secondary mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">25+ Countries</h3>
                                    <p className="text-sm text-muted-foreground">International cuisine</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                                <CardContent className="p-6 text-center">
                                    <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">Step-by-step</h3>
                                    <p className="text-sm text-muted-foreground">Detailed instructions</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {!hasSearched && (
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <Button onClick={handleRandomMeal} size="lg" className="flex items-center gap-2">
                                <Utensils className="h-5 w-5" />
                                Surprise Me!
                            </Button>
                            <Button variant="outline" size="lg" asChild className="flex items-center gap-2 bg-transparent">
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
                            <TrendingUp className="h-6 w-6 text-primary" />
                            <h2 className="text-3xl font-bold">Featured Today</h2>
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
                            <Star className="h-6 w-6 text-primary" />
                            <h2 className="text-3xl font-bold">Popular Categories</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map((category) => (
                                <Card
                                    key={category.idCategory}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                                    onClick={() => handleCategoryChange(category.strCategory)}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                                            <ChefHat className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="font-semibold group-hover:text-primary transition-colors">
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
                        <Search className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-bold">Browse by Category</h2>
                    </div>
                    <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <span className="text-xl font-medium">Finding delicious meals...</span>
                            <p className="text-muted-foreground mt-2">This won't take long!</p>
                        </div>
                    </div>
                )}

                {!isLoading && hasSearched && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-6">
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
                            <Card className="max-w-md mx-auto">
                                <CardContent className="text-center py-12">
                                    <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No meals found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Try searching with different keywords or browse our categories.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setHasSearched(false);
                                            setMeals([]);
                                            setSelectedCategory(null);
                                            setSearchQuery("");
                                        }}
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
