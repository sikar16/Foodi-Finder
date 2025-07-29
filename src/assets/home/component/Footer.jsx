import { Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { toast } from "../../../hooks/use-toast";
import { mealApi } from "../../../lib/meal-api";

export function Footer() {
    const handleRandomMeal = async () => {
        try {
            const randomMeal = await mealApi.getRandomMeal()
            if (randomMeal) {
                Navigate(`/meal/${randomMeal.idMeal}`)
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
    return (
        <footer className="bg-amber-900 text-amber-50 border-t border-amber-700">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <img
                                src="https://img.icons8.com/ios-filled/50/codechef.png"
                                alt="Foodie Finder"
                                className="h-6 w-6"
                            />
                            Foodie Finder
                        </h3>
                        <p className="text-amber-200">
                            Discover, cook, and share delicious recipes from around the world.
                            Our mission is to make cooking accessible and enjoyable for everyone.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="ghost" size="icon" className="text-amber-50 hover:bg-amber-800">
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-amber-50 hover:bg-amber-800">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-amber-50 hover:bg-amber-800">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-amber-50 hover:bg-amber-800">
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Quick Links</h3>
                        <ul className="space-y-2 text-amber-200">
                            <li>
                                <Link to="/" className="hover:text-amber-50 transition-colors">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link to="/" className="hover:text-amber-50 transition-colors">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/favorites" className="hover:text-amber-50 transition-colors">
                                    Favorites
                                </Link>
                            </li>
                            <li>
                                <Link to="/" onClick={handleRandomMeal} className="hover:text-amber-50 transition-colors">
                                    Random meal
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Popular Categories */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Popular Categories</h3>
                        <ul className="space-y-2 text-amber-200">
                            <li>
                                <a href="#" className="hover:text-amber-50 transition-colors">
                                    Desserts
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-50 transition-colors">
                                    Vegetarian
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-50 transition-colors">
                                    Chicken
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-50 transition-colors">
                                    Pasta
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-50 transition-colors">
                                    Quick Meals
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Newsletter</h3>
                        <p className="text-amber-200">
                            Subscribe to get weekly recipe inspiration and cooking tips!
                        </p>
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 rounded bg-amber-800 border border-amber-700 text-amber-50 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-amber-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-amber-300 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Foodie Finder. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-amber-300 hover:text-amber-50 text-sm">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-amber-300 hover:text-amber-50 text-sm">
                            Terms of Service
                        </a>
                        <a href="#" className="text-amber-300 hover:text-amber-50 text-sm">
                            Contact Us
                        </a>
                    </div>
                </div>


            </div>
        </footer>
    );
}