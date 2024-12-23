import { generateClient } from 'aws-amplify/api';
import { UserArticle } from '@/types/article';
import { GraphQLResult } from '@aws-amplify/api-graphql';

interface ListUserArticlesResponse {
    listUserArticles: {
        items: Array<{
            link?: string;
            owner?: string;
            publishedDate?: string;
            hostDomain?: string;
            summary?: string;
            title?: string;
            url?: string;
            score?: {
                depth_and_originality: number;
                quality: number;
                rating: number;
                relevance: number;
                simplified: number;
            };
        }>;
    };
}

interface CreateNewsletterInput {
    articles: {
        short: string[];
        medium: string[];
        long: string[];
    };
}

interface CreateNewsletterResponse {
    createNewsletter: {
        id: string;
        createdAt: string;
        owner: string;
        status: string;
        updatedAt: string;
        articles: {
            long: string[];
            medium: string[];
            short: string[];
        };
    };
}

export async function listUserArticles(startDate: Date): Promise<UserArticle[]> {
    const client = generateClient();
    const variables = {
        startDate: startDate.toISOString(),
    };

    try {
        const response = (await client.graphql({
            query: `
                query ListUserArticles($startDate: String!) {
                    listUserArticles(input: {startDate: $startDate}) {
                        items {
                            link
                            owner
                            publishedDate
                            hostDomain
                            summary
                            title
                            url
                            score {
                                depth_and_originality
                                quality
                                rating
                                relevance
                                simplified
                            }
                        }
                    }
                }
            `,
            variables,
        })) as GraphQLResult<ListUserArticlesResponse>;

        if (!response.data) {
            return [];
        }

        return response.data.listUserArticles.items.map((item) => ({
            link: item.link || '',
            title: item.title || '',
            summary: item.summary || '',
            hostDomain: item.hostDomain || '',
            publishedDate: item.publishedDate ? new Date(item.publishedDate) : undefined,
            relativeDate: getRelativeTime(
                item.publishedDate ? new Date(item.publishedDate) : new Date(),
                new Date()
            ),
            score: {
                depth_and_originality: item.score?.depth_and_originality || 0,
                quality: item.score?.quality || 0,
                rating: item.score?.rating || 0,
                relevance: item.score?.relevance || 0,
                simplified: item.score?.simplified || 0,
            },
            rating: item.score?.rating || 0,
        }));
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

export async function createNewsletter(input: CreateNewsletterInput): Promise<CreateNewsletterResponse['createNewsletter']> {
    const client = generateClient();
    
    const result = await client.graphql<CreateNewsletterResponse>({
        query: `
            mutation CreateUserNewsletter($input: CreateNewsletterInput!) {
                createNewsletter(input: $input) {
                    id
                    createdAt
                    owner
                    status
                    updatedAt
                    articles {
                        long
                        medium
                        short
                    }
                }
            }
        `,
        variables: {
            input,
        },
    });

    if (!result.data?.createNewsletter) {
        throw new Error('Failed to create newsletter');
    }

    return result.data.createNewsletter;
}

function getRelativeTime(date: Date, now: Date): string {
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    if (diffInMinutes > 0) return `${diffInMinutes}m ago`;
    return 'just now';
}
