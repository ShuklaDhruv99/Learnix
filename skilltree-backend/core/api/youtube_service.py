import environ
import os
import requests
from django.conf import settings

env = environ.Env()
environ.Env.read_env(os.path.join(settings.BASE_DIR, '.env'))

YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'


def search_youtube_videos(query, max_results=3):
    """
    Search YouTube for videos matching `query`. Returns a list of dicts:
    [{ 'title': ..., 'channel': ..., 'video_id': ..., 'url': ... }, ...]
    """
    api_key = env('YOUTUBE_API_KEY')
    params = {
        'part': 'snippet',
        'q': query,
        'type': 'video',
        'maxResults': max_results,
        'relevanceLanguage': 'en',
        'safeSearch': 'strict',
        'key': api_key,
    }

    response = requests.get(YOUTUBE_SEARCH_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    results = []
    for item in data.get('items', []):
        video_id = item['id']['videoId']
        snippet = item['snippet']
        results.append({
            'title': snippet['title'],
            'channel': snippet['channelTitle'],
            'video_id': video_id,
            'url': f'https://www.youtube.com/watch?v={video_id}',
        })
    return results