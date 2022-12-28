#!/usr/bin/env python3

import miniflux
import argparse
import os
import json

def format_entry(entry: dict) -> dict:
    
    fields = ['title', 'url', 'comments_url', 'published_at', 'feed']
    e = {f: entry[f] for f in fields}
    e['feed'] = e['feed']['title']
    if e['comments_url'] == '':
        del e['comments_url']
    return e

def update_feed(client:miniflux.Client, category:int, instance: str, token:str, num_entries:int) -> None:

    entries = client.get_entries(
        category_id=category,
        direction='desc',
        order='published_at',
        limit=num_entries)
    entries = [format_entry(e) for e in entries['entries']]
    return entries

if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="miniminiflux")
    parser.add_argument(
        "-n",
        default=200,
        dest="num_entries",
        help="How many entries to include in the stream",
        type=int
    )
    args = parser.parse_args()

    output = 'reader/entries.json'
    instance = os.getenv('INSTANCE')
    token = os.getenv('TOKEN')

    client = miniflux.Client(instance, api_key=token)
    categories = client.get_categories()
    feed = []

    for category in categories:
        
        entries = update_feed(
            client,
            category['id'],
            instance,
            token,
            args.num_entries,
        )
        feed.append({'name':category['title'], 'entries':entries})

    with open(output, 'w+') as f:
        json.dump(feed, f)