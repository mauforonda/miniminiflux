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

def update_feed(instance: str, token:str, num_entries:int, output:str) -> None:

    client = miniflux.Client(instance, api_key=token)
    entries = client.get_entries(
        direction='desc',
        order='published_at',
        limit=num_entries)
    entries = [format_entry(e) for e in entries['entries']]
    with open(output, 'w+') as f:
        json.dump(entries, f)

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

    update_feed(
        instance,
        token,
        args.num_entries,
        output
    )
