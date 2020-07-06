const express = require('express');
const path = require('path');
const helmet = require('helmet');

const {
    ApolloServer,
    gql
} = require('apollo-server-express');
const {
    GraphQLList
} = require('graphql');
const {
    find
} = require('lodash');
const {
    init
} = require('./read');
const dirNames = ['./data/domains/', './data/entities/'];

init(dirNames).then((value) => {
    REST = {
        names() {
            let arr = [];
            for (let i = 0; i < value.entities.length; i++) {
                const element = value.entities[i];
                arr.push(element.name)
            }
            return arr;
        },
        findEntity(name) {
            return find(value.entities, {
                    name: name
                }) ?
                find(value.entities, {
                    name: name
                }) : {
                    ERROR: `${name} not found`
                }
        },
        findDomains(name) {
            let arr = [];
            let obj = find(value.entities, {
                name: name
            })
            if (!obj) {
                return {
                    ERROR: `${name} not found`
                }
            }
            obj.properties.forEach(element => {
                let obj = find(value.domains, {
                    domain: element
                })
                obj ?
                    arr.push(obj) : arr.push({
                        domain: element
                    })
            });
            return arr;
        }
    }
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
            owner : List
            source : List
            prevalence: Float
            sites: Int
            subdomains: List
            resources : [Resource]
            categories: List
            cookies : Float
            performance: Performance
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
            entity(name : String): [Entity]
        }
    `;

    // Provide resolver functions for your schema fields
    const resolvers = {
        List: GraphQLList,
        Query: {
            entities: () => value.entities,
            entity: (parent, args, context, info) => {
                let obj = find(value.entities, {
                    name: args.name
                });
                if (!obj) {
                    return null
                }
                return [obj]
            }
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
                return arg.owner ? [arg.owner] : []
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
    app.use(helmet());
    server.applyMiddleware({
        app,
        path: '/api/graphql'
    });
    app.get('/api/REST/', (req, res) => {
        res.json({
            "data": REST.names()
        })
    })
    app.get('/api/REST/:name', (req, res) => {
        let data = REST.findEntity(req.params.name);
        if (data.ERROR) {
            res.json(data)
            return;
        }
        res.json({
            "data": data
        })
    })
    app.get('/api/REST/:name/domains', (req, res) => {
        let data = REST.findDomains(req.params.name)
        if (data.ERROR) {
            res.json(data);
            return;
        }
        res.json({
            "data": data
        })
    })
    app.get('/api/REST/:name/combine', (req, res) => {
        //Added spread operator since it was causing a bug with the override data.properties down below
        let data = {
            ...REST.findEntity(req.params.name)
        };
        if (data.ERROR) {
            res.json(data);
            return;
        }
        data.properties = [...REST.findDomains(req.params.name)]
        res.json({
            "data": data
        })
    })
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/index.html'));
    })
    app.get('*', (req, res) => {
        res.redirect('/')
    })
    app.listen({
            port: 4000
        }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
})