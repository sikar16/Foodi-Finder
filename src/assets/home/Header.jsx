import { useState, useEffect } from "react"
import { ChefHat, Home, Heart, Shuffle, Globe, Tag, UtensilsCrossed, Menu } from "lucide-react"
import { Button } from "../../components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "../../components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { toast } from "../../hooks/use-toast"
import { mealApi } from "../../lib/meal-api"
import { Link, useLocation, useNavigate } from "react-router-dom"

export function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const [categories, setCategories] = useState([])
    const [areas, setAreas] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, areasData] = await Promise.all([mealApi.getCategories(), mealApi.getAreas()])
                setCategories(categoriesData.slice(0, 12))
                setAreas(areasData.slice(0, 15))
            } catch (error) {
                console.error("Error fetching header data:", error)
            }
        }

        fetchData()
    }, [])

    const handleRandomMeal = async () => {
        try {
            const randomMeal = await mealApi.getRandomMeal()
            if (randomMeal) {
                navigate(`/meal/${randomMeal.idMeal}`)
            } else {
                toast({
                    title: "Error",
                    description: "Could not fetch a random meal. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error fetching random meal:", error)
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleCategoryClick = (category) => {
        navigate(`/?category=${encodeURIComponent(category)}`)
        setIsOpen(false)
    }

    const handleAreaClick = (area) => {
        navigate(`/?area=${encodeURIComponent(area)}`)
        setIsOpen(false)
    }

    const NavItems = () => (
        <>
            <Button variant="ghost" size="sm" asChild>
                <Link to="/" className={`flex items-center space-x-2 ${pathname === "/" ? "bg-accent" : ""}`}>
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
                <Link
                    to="/favorites"
                    className={`flex items-center space-x-2 ${pathname === "/favorites" ? "bg-accent" : ""}`}
                >
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <Tag className="h-4 w-4" />
                        <span>Categories</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                    <DropdownMenuLabel>Browse by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map((category) => (
                        <DropdownMenuItem
                            key={category.idCategory}
                            onClick={() => handleCategoryClick(category.strCategory)}
                            className="cursor-pointer"
                        >
                            {category.strCategory}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Countries</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                    <DropdownMenuLabel>Browse by Country</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {areas.map((area) => (
                        <DropdownMenuItem
                            key={area.strArea}
                            onClick={() => handleAreaClick(area.strArea)}
                            className="cursor-pointer"
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
                className="flex items-center space-x-2 bg-transparent"
            >
                <Shuffle className="h-4 w-4" />
                <span>Random</span>
            </Button>
        </>
    )

    return (
        <header className="sticky top-0 z-50 w-full px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="relative">
                        {/* <ChefHat className="h-8 w-8 text-primary" /> */}
                        {/* <UtensilsCrossed className="h-8 w-8 text-primary" /> */}
                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/codechef.png" alt="codechef" className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold">
                            Foodie Finder
                        </span>
                        <span className="text-xs text-muted-foreground hidden sm:block">Discover World Cuisine</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-2">
                    <NavItems />
                </nav>

                {/* Mobile Navigation */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="sm">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <div className="flex flex-col space-y-4 mt-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <ChefHat className="h-6 w-6 text-primary" />
                                <span className="text-lg font-semibold">Menu</span>
                            </div>
                            <NavItems />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
