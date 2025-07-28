import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";

export function SearchBar({ onSearch, isLoading }) {
    const [query, setQuery] = useState("");
    const [searchType, setSearchType] = useState("name");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim(), searchType);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        type="text"
                        placeholder={`Search by ${searchType}...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                    />
                </div>

                <Select
                    value={searchType}
                    onValueChange={(value) => setSearchType(value)}
                >
                    <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">By Name</SelectItem>
                        <SelectItem value="ingredient">By Ingredient</SelectItem>
                    </SelectContent>
                </Select>

                <Button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? "Searching..." : "Search"}
                </Button>
            </div>
        </form>
    );
}
