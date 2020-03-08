const express = require('express');
const {
    ApolloServer,
    gql
} = require('apollo-server-express');
const {
    GraphQLList
} = require('graphql');
const {
    find,
    filter
} = require('lodash');
const readDir = require('./read');
const dirNames = ['./data/domains/', './data/entities/'];

readDir.init(dirNames).then((value) => {

    // Construct a schema, using GraphQL schema language
    const typeDefs = gql `
        scalar List

        type Entity {
            name : String
            properties: [Domain]
            prevalence : Prevalence
        }
        type Prevalence{
            tracking: Float
            nonTracking : Float
            total : Float
        }
        type Domain {
            domain : String
            owner : Owner
            source : List
            prevalence: Float
            sites: Int
            subdomains: List
            resources : [Resource]
            categories: List
            cookies : Float
            performance: Performance
        }
        type Owner {
            name : String
            displayName : String
        }
        type Resource {
            rule: String
            cookies: Float
            fingerprinting: Int
            subdomains: List
            apis : List
            sites: Int
            prevalence: Float
        }
        type Performance {
            time: Int
            size: Int
            cpu: Int
            cache: Int
        }
        type Query {
            entities : [Entity]
        }
    `;

    // Provide resolver functions for your schema fields
    const resolvers = {
        List: GraphQLList,
        Query: {
            entities: () => value.entities,
        },
        Entity: {
            prevalence(arg) {
                let obj = find(value.entities, {
                    name: arg.name
                });
                return obj.prevalence;
            },
            properties(arg) {
                let arr = [];
                arg.properties.forEach(element => {
                    find(value.domains, {
                            domain: element
                        }) ?
                        arr.push(find(value.domains, {
                            domain: element
                        })) : arr.push({
                            domain: element
                        })
                });
                return arr;
            }
        },
        Domain: {
            owner(arg) {
                return arg.owner ? arg.owner : {
                    name: 'N/A',
                    displayName: 'N/A'
                }
            },
            source(arg) {
                return arg.source ? arg.source : [];
            },
            subdomains(arg) {
                return arg.subdomains ? arg.subdomains : [];
            },
            resources(arg) {
                return arg.resources ? arg.resources : [];
            },
            categories(arg) {
                return arg.categories ? arg.categories : [];
            },
            performance(arg) {
                return arg.performance ? arg.performance : {};
            }
        },
        Resource: {
            subdomains(arg) {
                return arg.subdomains ? arg.subdomains : [];
            },
            apis(arg) {
                if (arg.apis) {
                    let obj = {};
                    for (let [key, value] of Object.entries(arg.apis)) {
                        obj[key] = value
                    }
                    return [obj];
                } else {
                    return [];
                }
            }
        }
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    const app = express();
    server.applyMiddleware({
        app
    });
    app.get('/', (req, res) => {
        res.json(value)
    })
    app.listen({
            port: 4000
        }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
})