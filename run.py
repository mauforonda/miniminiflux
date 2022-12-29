#!/usr/bin/env python3

import miniflux
import argparse
import os
import json

def format_entry(entry: dict, post_directory:str) -> dict:
    
    fields = ['id', 'title', 'url', 'comments_url', 'published_at', 'feed']
    e = {f: entry[f] for f in fields}
    e['feed'] = e['feed']['title']
    if e['comments_url'] == '':
        del e['comments_url']
    
    with open(f'{post_directory}/{e["id"]}','w+') as f:
        f.write(entry['content'])
        
    return e

def update_feed(client:miniflux.Client, category:int, instance: str, token:str, num_entries:int, post_directory:str) -> None:

    entries = client.get_entries(
        category_id=category,
        direction='desc',
        order='published_at',
        limit=num_entries)
    entries = [format_entry(e, post_directory) for e in entries['entries']]
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
    post_directory = 'reader/posts'
    if not os.path.exists(post_directory):
        os.mkdir(post_directory)

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
            post_directory
        )
        feed.append({'name':category['title'], 'entries':entries})

    with open(output, 'w+') as f:
        json.dump(feed, f)