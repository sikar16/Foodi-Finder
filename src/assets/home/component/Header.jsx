import { useState, useEffect } from "react";
import { ChefHat, Home, Heart, Shuffle, Globe, Tag, UtensilsCrossed, Menu } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "../../../components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet";
import { toast } from "../../../hooks/use-toast";
import { mealApi } from "../../../lib/meal-api";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, areasData] = await Promise.all([
                    mealApi.getCategories(),
                    mealApi.getAreas(),
                ]);
                setCategories(categoriesData.slice(0, 12));
                setAreas(areasData.slice(0, 15));
            } catch (error) {
                console.error("Error fetching header data:", error);
            }
        };

        fetchData();
    }, []);

    const handleRandomMeal = async () => {
        try {
            const randomMeal = await mealApi.getRandomMeal();
            if (randomMeal) {
                navigate(`/meal/${randomMeal.idMeal}`);
            } else {
                toast({
                    title: "Error",
                    description: "Could not fetch a random meal. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching random meal:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleCategoryClick = (category) => {
        navigate(`/?category=${encodeURIComponent(category)}`);
        setIsOpen(false);
    };

    const handleAreaClick = (area) => {
        navigate(`/?area=${encodeURIComponent(area)}`);
        setIsOpen(false);
    };

    const NavItems = () => (
        <>
            <Button
                variant="ghost"
                size="sm"
                asChild
                className={`flex items-center space-x-2 ${pathname === "/" ? "bg-amber-100 text-amber-900" : "text-amber-800 hover:bg-amber-100 hover:text-amber-900"}`}
            >
                <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                </Link>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                asChild
                className={`flex items-center space-x-2 ${pathname === "/favorites" ? "bg-amber-100 text-amber-900" : "text-amber-800 hover:bg-amber-100 hover:text-amber-900"}`}
            >
                <Link to="/favorites">
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                    >
                        <Tag className="h-4 w-4" />
                        <span>Categories</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto bg-amber-50 border-amber-200">
                    <DropdownMenuLabel className="text-amber-900">Browse by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-amber-200" />
                    {categories.map((category) => (
                        <DropdownMenuItem
                            key={category.idCategory}
                            onClick={() => handleCategoryClick(category.strCategory)}
                            className="cursor-pointer text-amber-800 hover:bg-amber-100 focus:bg-amber-100"
                        >
                            {category.strCategory}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                    >
                        <Globe className="h-4 w-4" />
                        <span>Countries</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto bg-amber-50 border-amber-200">
                    <DropdownMenuLabel className="text-amber-900">Browse by Country</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-amber-200" />
                    {areas.map((area) => (
                        <DropdownMenuItem
                            key={area.strArea}
                            onClick={() => handleAreaClick(area.strArea)}
                            className="cursor-pointer text-amber-800 hover:bg-amber-100 focus:bg-amber-100"
                        >
                            {area.strArea}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                size="sm"
                onClick={handleRandomMeal}
                className="flex items-center space-x-2 border-amber-300 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
            >
                <Shuffle className="h-4 w-4" />
                <span>Random</span>
            </Button>
        </>
    );

    return (
        <header className="sticky top-0 z-50 w-full px-4 border-b border-amber-200 bg-amber-50/95 backdrop-blur supports-[backdrop-filter]:bg-amber-50/60">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="relative">
                        <img
                            width="50"
                            height="50"
                            src="https://img.icons8.com/ios-filled/50/codechef.png"
                            alt="codechef"
                            className="h-12 w-12"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-amber-900">
                            Foodie Finder
                        </span>
                        <span className="text-xs text-amber-600 hidden sm:block">Discover World Cuisine</span>
                    </div>
                </Link>


                <nav className="hidden md:flex items-center space-x-2">
                    <NavItems />
                </nav>


                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-[300px] sm:w-[400px] bg-amber-50 border-l border-amber-200"
                    >
                        <div className="flex flex-col space-y-4 mt-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <ChefHat className="h-6 w-6 text-amber-600" />
                                <span className="text-lg font-semibold text-amber-900">Menu</span>
                            </div>
                            <NavItems />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}