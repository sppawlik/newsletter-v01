export interface Score {
    depth_and_originality: number;
    quality: number;
    relevance: number;
    rating: number;
    simplified: number;
}

export interface UserArticle {
    link: string;
    title: string;
    summary: string;
    hostDomain: string;
    relativeDate: string;
    publishedDate?: Date;
    score: Score;
    rating: number;
}

export type SummaryLength = 'short' | 'medium' | 'long';
