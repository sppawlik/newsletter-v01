import { useEffect, useState } from 'react';
import { ArticleItem } from './ArticleItem';
import { UserArticle, SummaryLength } from '@/types/article';
import { listUserArticles, createNewsletter } from '@/lib/api/articles';
import { Button } from '@/components/ui/button';

interface ArticleListProps {
    onSelectedArticlesChange?: (selectedArticles: Set<string>) => void;
    onSummaryLengthChange?: (articleId: string, length: SummaryLength) => void;
}

export function ArticleList({
    onSelectedArticlesChange,
    onSummaryLengthChange,
}: ArticleListProps): JSX.Element {
    const [articles, setArticles] = useState<UserArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                setHasError(false);
                const fetchedArticles = await listUserArticles(startDate);
                setArticles(fetchedArticles);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleArticleSelect = (articleId: string, selected: boolean) => {
        setSelectedArticles((prev) => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(articleId);
            } else {
                newSet.delete(articleId);
            }
            return newSet;
        });
        onSelectedArticlesChange?.(selectedArticles);
    };

    const handleSummaryLengthChange = (articleId: string, length: SummaryLength) => {
        onSummaryLengthChange?.(articleId, length);
    };

    const handleGenerateNewsletter = async () => {
        try {
            const selectedArticlesArray = Array.from(selectedArticles);
            const input = {
                articles: {
                    short: selectedArticlesArray.filter(id => 
                        articles.find(a => a.id === id)?.summaryLength === 'short'
                    ),
                    medium: selectedArticlesArray.filter(id => 
                        articles.find(a => a.id === id)?.summaryLength === 'medium'
                    ),
                    long: selectedArticlesArray.filter(id => 
                        articles.find(a => a.id === id)?.summaryLength === 'long'
                    )
                }
            };

            const result = await createNewsletter(input);
            
            // Open newsletter in new tab
            window.open(`/newsletter/${result.id}`, '_blank');
        } catch (error) {
            console.error('Error generating newsletter:', error);
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading articles...</div>;
    }

    if (hasError) {
        return <div className="text-center py-4 text-red-500">Failed to load articles. Please try again later.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Articles</h2>
                <Button 
                    onClick={handleGenerateNewsletter}
                    disabled={selectedArticles.size === 0}
                    className="bg-primary hover:bg-primary/90"
                >
                    Generate Newsletter
                </Button>
            </div>
            
            {articles.length === 0 ? (
                <div className="text-center py-4">No articles found</div>
            ) : (
                articles.map((article) => (
                    <ArticleItem
                        key={article.link}
                        article={article}
                        isSelected={selectedArticles.has(article.link)}
                        onSelect={(selected) => handleArticleSelect(article.link, selected)}
                        onSummaryLengthChange={(length) => handleSummaryLengthChange(article.link, length)}
                    />
                ))
            )}
        </div>
    );
}
