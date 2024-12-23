'use client';

import { ArticleList } from '@/components/articles/ArticleList';
import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: "eu-central-1_bIWHnJVBD",
            userPoolClientId: "17po79u1lq2hlvij0gnkulhkq4",
        }
    },
    API: {
        GraphQL: {
            endpoint: 'https://sw7s4gupwbesxmbt3sjalzogli.appsync-api.eu-central-1.amazonaws.com/graphql',
            region: 'eu-central-1',
            defaultAuthMode: 'userPool',
            apiKey: 'da2-jm4mxuuosbfudcetzhvjtshrme'
        }
    }
});

export default function Home(): JSX.Element {
    return (
        <Authenticator>
            {({ signOut }) => (
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Your Articles</h1>
                        <button
                            onClick={signOut}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Sign Out
                        </button>
                    </div>
                    <ArticleList />
                </main>
            )}
        </Authenticator>
    );
}
