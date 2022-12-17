A stream of links powered by miniflux and github actions

[see live](https://mauforonda.github.io/miniminiflux)

Make it your own

- fork this repo
- set your miniflux `INSTANCE`and `TOKEN` as repo secrets
- tweak how often you want your stream to update (`cron`) and how many links to display (`python run.py -n $NUMBER_OF_ENTRIES`) in the [workflow](.github/workflows/update.yml)
