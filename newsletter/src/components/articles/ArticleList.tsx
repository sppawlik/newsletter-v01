import { useEffect, useState } from 'react';
import { ArticleItem } from './ArticleItem';
import { UserArticle, SummaryLength } from '@/types/article';
import { listUserArticles, createNewsletter } from '@/lib/api/articles';
import { Button } from '@/components/ui/button';

interface ArticleListProps {
    onSelectedArticlesChange?: (selectedArticles: Set<string>) => void;
    onSummaryLengthChange?: (articleId: string, length: SummaryLength) => void;
}

interface ArticleWithSelection extends UserArticle {
    id: string;
    summaryLength: SummaryLength;
}

export function ArticleList({
    onSelectedArticlesChange,
    onSummaryLengthChange,
}: ArticleListProps): JSX.Element {
    const [articles, setArticles] = useState<ArticleWithSelection[]>([]);
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
                // Transform articles to include id and default summaryLength
                const articlesWithSelection = fetchedArticles.map(article => ({
                    ...article,
                    id: article.link, // Using link as id since it should be unique
                    summaryLength: 'medium' as SummaryLength // Default to medium
                }));
                setArticles(articlesWithSelection);
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
            onSelectedArticlesChange?.(newSet);
            return newSet;
        });
    };

    const handleSummaryLengthChange = (articleId: string, length: SummaryLength) => {
        setArticles(prev => 
            prev.map(article => 
                article.id === articleId 
                    ? { ...article, summaryLength: length }
                    : article
            )
        );
        onSummaryLengthChange?.(articleId, length);
    };

    const handleGenerateNewsletter = async () => {
        try {
            const input = {
                articles: {
                    short: articles
                        .filter(article => 
                            selectedArticles.has(article.id) && 
                            article.summaryLength === 'short'
                        )
                        .map(article => article.link),
                    medium: articles
                        .filter(article => 
                            selectedArticles.has(article.id) && 
                            article.summaryLength === 'medium'
                        )
                        .map(article => article.link),
                    long: articles
                        .filter(article => 
                            selectedArticles.has(article.id) && 
                            article.summaryLength === 'long'
                        )
                        .map(article => article.link)
                }
            };

            const result = await createNewsletter(input);
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
                    variant="default"
                >
                    Generate Newsletter
                </Button>
            </div>
            
            <div className="space-y-4">
                {articles.map((article) => (
                    <ArticleItem
                        key={article.id}
                        article={article}
                        isSelected={selectedArticles.has(article.id)}
                        onSelect={(selected) => handleArticleSelect(article.id, selected)}
                        onSummaryLengthChange={(length) => handleSummaryLengthChange(article.id, length)}
                    />
                ))}
                {articles.length === 0 && (
                    <div className="text-center py-4">No articles found</div>
                )}
            </div>
        </div>
    );
}
