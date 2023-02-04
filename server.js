import { ApolloServer, gql } from "apollo-server";
import { users, tweets } from "./mock.js";

const typeDefs = gql`
	type User {
		id: ID
		name: String
		nickName: String
	}
	type Tweet {
		id: ID
		text: String
		author: User
	}
	type Sample {
		id: ID
    	email: String
    	first_name: String
    	last_name: String
    	avatar: String
	}
	type Query {
		ping: String
		allUsers: [User!]!
		allTweets: [Tweet!]!
		tweet(id: ID): Tweet
		sampleRest: [Sample!]!
	}
	type Mutation {
		postTweet(userId: ID, text: String): Tweet
		deleteTweet(id: ID): Boolean
	}
`;


const resolvers = {
	Query: {
		ping() {
			return "pong";
		},
		allUsers() {
			return users;
		},
		allTweets() {
			return tweets;
		},
		tweet(root, {id}) {
			return tweets.find(tweet => tweet.id === id);
		},
		sampleRest() {
			return fetch("https://reqres.in/api/users?page=1")
				.then((r) => r.json())
				.then((json) => json.data);
		}
	},
	Mutation: {
		postTweet(root, { userId, text }) {
			const newTweet = {
				id: tweets.length+1,
				text,
				userId
			};
			tweets.push(newTweet);
			return newTweet;
		},
		deleteTweet(root, { id }) {
			const toDelete = tweets.find(tweet => tweet.id === id);
			if (!toDelete) return false;
			tweets = tweets.filter(tweet => tweet.id !== id);
			return true;
		}
	},
	User: {
		nickName({ name }) {
			return `brave ${name}`;
		}
	},
	Tweet: {
		author({ userId }) {
			return users.find(user => user.id === userId);
		}
	}
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
	console.log(`Running on ${url}`);
});

