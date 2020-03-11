## REST and GraphQL API based on DuckDuckGo Tracker Radar Data

#### ***GraphQL*** Example Data
Endpoint for all GraphQL /api/graphql

Returns all entities with domain data
```
{
  entities{
    name
    properties{
      domain
      sites
    }
  }
}
```
#### ***GraphQL*** Filter Example
Returns entity if found
(You can use /api/rest in combination with this graphql endpoint to get names)
```
{
  entity(name: "Google LLC"){
    name
    properties{
      domain
      sites
    }
  }
}
```
GraphQL endpoint tries to match main entity EG: Google LLC with registered sub domains EG: googleapis.com, this allows you to filter by main entity and get all data about sub domains like below:

```
     "name": "Google LLC",
     "properties": [
       {
         "domain": "googleapis.com",
         "sites": 26016
       },
       {
         "domain": "google-analytics.com",
         "sites": 34142
       },
       {
         "domain": "googletagmanager.com",
         "sites": 20644
       },
       {
         "domain": "google.com",
         "sites": 27658
       },
       {
         "domain": "googletagservices.com",
         "sites": 12019
       },
       {
         "domain": "googlesyndication.com",
         "sites": 12135
       }, ...]
```
#### ***REST*** Example Data

Endpoint: /api/rest
Returns a list of name that can be used to search in next endpoints
```
  "data": [
    "\"Agency of investigative reporters\" Company limited",
    "\"Begun\" JSC",
    "\"Buttinette\" Textil-Versandhaus GmbH",
    "\"CN-Software\" Ltd.",
    "\"Computing Forces\" CJSC",
    "\"Die Presse\" Verlags-Gesellschaft m.b.H. & Co KG",
    "\"Fashion Press\"",
    "\"Fin-Service 2000\", Inc.",
    "\"Gazeta.Ru\" JSC",
    "\"Group IB Service\" Ltd.",
    ...]
```
Endpoint: /api/rest/:name
Returns information about given :name and domains :name has
```
  "data": {
    "name": "Google LLC",
    "displayName": "Google",
    "properties": [
      {
        "domain": "0m66lx69dx.com"
      },
      {
        "domain": "1e100cdn.net"
      },
      {
        "domain": "1emn.com"
      },
      {
        "domain": "1enm.com"
      },
      {
        "domain": "2enm.com"
      },
      ...]
```
Endpoint: /api/rest/:name/domains
Returns list of objects that store information about :name domains
```
  "data": [
    {
      "domain": {
        "domain": "0m66lx69dx.com"
      }
    },
    {
      "domain": {
        "domain": "1e100cdn.net"
      }
    },
    {
      "domain": {
        "domain": "2mdn.net",
        "owner": {
          "name": "Google LLC",
          "displayName": "Google",
          "privacyPolicy": "https://policies.google.com/privacy?hl=en&gl=us",
          "url": "http://google.com"
        },
        "source": [
          "DuckDuckGo"
        ]
      }...}
```
Endpoint /api/rest/:name/combine
Returns combined information of last two endpoints in one big object
```
  "data": {
    "name": "Google LLC",
    "displayName": "Google",
    "properties": [
      {
        "domain": {
          "domain": "0m66lx69dx.com"
        }
      },
      {
        "domain": {
          "domain": "2mdn.net",
          "owner": {
            "name": "Google LLC",
            "displayName": "Google",
            "privacyPolicy": "https://policies.google.com/privacy?hl=en&gl=us",
            "url": "http://google.com"
          },
          "source": [
            "DuckDuckGo"
          ],
        }...}
```
