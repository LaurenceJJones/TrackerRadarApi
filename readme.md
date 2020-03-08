## REST and GraphQL API based on DuckDuckGo Tracker Radar Data

### Todo
1. Add filter to GraphQL endpoint
2. REST Service with filter Endpoints

#### ***GraphQL*** Example Data
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

GraphQL endpoint tries to match main entity EG: Google LLC with registered sub domains EG:
googleapis.com, this allows you to filter by main entity and get all data about sub domains like below:

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
```
***WIP***
```