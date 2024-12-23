import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { UserArticle, SummaryLength } from "../../types/article";
import { Globe } from "lucide-react";

interface ArticleItemProps {
    article: UserArticle;
    onSelect: (selected: boolean) => void;
    onSummaryLengthChange: (length: SummaryLength) => void;
    isSelected: boolean;
}

export function ArticleItem({ 
    article, 
    onSelect, 
    onSummaryLengthChange, 
    isSelected 
}: ArticleItemProps) {
    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <div className="pt-1">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => onSelect(checked as boolean)}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Host Domain and Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Globe className="h-4 w-4" />
                            <span>{article.hostDomain}</span>
                            <span>•</span>
                            <span>{article.relativeDate}</span>
                        </div>

                        {/* Title and Summary */}
                        <div className="mb-3">
                            <h3 className="font-semibold mb-2">
                                <a href={article.link} target="_blank" rel="noopener noreferrer" 
                                   className="hover:underline">
                                    {article.title}
                                </a>
                            </h3>
                            <p className="text-sm text-muted-foreground">{article.summary}</p>
                        </div>

                        {/* Bottom Row: Scores and Summary Length Selector */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Rating: </span>
                                    <span>{article.score.rating.toFixed(1)}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Simplified: </span>
                                    <span>{article.score.simplified.toFixed(1)}</span>
                                </div>
                            </div>

                            {/* Summary Length Selector */}
                            <Select
                                defaultValue="medium"
                                onValueChange={(value) => onSummaryLengthChange(value as SummaryLength)}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Summary length" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="short">Short</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="long">Long</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
