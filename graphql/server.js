import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import axios from 'axios'

const app = express()
/**
 * ID
 * String
 * Int
 * Float
 * Boolean
 * List - []
 */
let message = 'Hi I am learning graphQL mutation'
const schema = buildSchema(`

  type Post {
    userId: Int
    id: Int
    title: String
    body: String
  }

  type User {
    name: String
    age: Int
    college: String
  }

  input UserInput {
    name: String!
    age: Int!
    college: String!
  }

  type Query {
    hello: String!
    welcomeMessage(name: String, dayOfWeek: String!): String
    getUser: User
    getUsers: [User]
    getPostsFromExternalAPIs: [Post]
    message: String
  }

  type Mutation {
    setMessage(newMessage: String): String
    createUser(user: UserInput) : User
  }
`)

const root = {
	hello: () => {
		return 'Hello world!'
		// return null
	},
	welcomeMessage: (args) => {
		return `Hi I am ${args.name}, today is ${args.dayOfWeek} week of 2022`
	},
	getUser: () => {
		const user = {
			name: 'Azim Ansari',
			age: 24,
			college: 'Cluster Innovation Center Delhi',
		}
		return user
	},
	getUsers: () => {
		const users = [
			{
				name: 'Azim Ansari',
				age: 24,
				college: 'Cluster Innovation Center Delhi',
			},
			{
				name: 'Shamim Ansari',
				age: 26,
				college: 'Patna univercity',
			},
		]
		return users
	},
	getPostsFromExternalAPIs: async () => {
		const post = await axios.get(
			`https://jsonplaceholder.typicode.com/posts`
		)
		return post.data
	},
	setMessage: ({ newMessage }) => {
		console.log('newMessage', newMessage)
		message = newMessage
		return message
	},
	message: () => {
		return message
	},
	createUser: (args) => {
		//create a new user inside db
		return args.user
	},
}

app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true,
	})
)
app.listen(4000, () =>
	console.log('✨ browse is running on localhost:4000/graphql')
)
